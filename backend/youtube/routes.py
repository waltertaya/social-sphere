from flask import redirect, url_for, session, request, Blueprint, jsonify
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials

from flask_jwt_extended import jwt_required, get_jwt_identity
import secrets
import json

from .cache import r

youtube_routes = Blueprint('youtube_routes', __name__)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # For local testing only

# Load client secrets file
CLIENT_SECRETS_FILE = "client_secret.json"

# Define OAuth scopes
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

load_dotenv()

# Initialize Flow
flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=SCOPES,
    redirect_uri="http://localhost:8080/api/v2/bd/youtube/callback"  # Make sure this matches in your client_secret.json
)

@youtube_routes.route("/auth", methods=["GET"])
@jwt_required()
def auth():
    user_id = get_jwt_identity()

    # check if the user ia already linked: 
    if r.get(user_id):
        # return redirect("http://localhost:5173?status=already_linked")
        return jsonify({"status": "already_linked"})
    
    state = secrets.token_urlsafe(16)  # Generate a random state token

    # Store state and user_id in Redis
    r.set(state, user_id, ex=300)  # Expire after 5 minutes

    authorization_url, _ = flow.authorization_url(
        access_type="offline", include_granted_scopes="true", state=state, prompt="consent"
    )
    return jsonify({"auth_url": authorization_url})


@youtube_routes.route("/callback", methods=["GET"])
def callback():
    state = request.args.get("state")
    if not state:
        return jsonify({"error": "Missing state parameter"}), 400

    user_id = r.get(state)
    if not user_id:
        return jsonify({"error": "Invalid or expired state token"}), 400

    # Decode user_id if it's in bytes
    if isinstance(user_id, bytes):
        user_id = user_id.decode("utf-8")

    try:
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials

        # Save credentials in Redis
        r.set(user_id, credentials.to_json())

        # Save credentials in session (optional)
        session["credentials"] = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
        }

        return redirect("http://localhost:5173?status=success")
        # return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@youtube_routes.route("/logout", methods=["GET"])
@jwt_required()
def logout():
    """Logout the user and clear session."""
    session.clear()
    # remove credentials from cache
    user_id = get_jwt_identity()
    r.delete(user_id)
    return jsonify({"msg": "Logged out successfully!"})


@youtube_routes.route("/status", methods=["GET"])
@jwt_required()
def status():
    user_id = get_jwt_identity()
    if r.get(user_id):
        return jsonify({"linked": True})
    return jsonify({"linked": False})


@youtube_routes.route("/videos", methods=["GET"])
@jwt_required()
def get_videos():
    """Retrieve the user's uploaded videos."""
    user_id = get_jwt_identity()
    stored_credentials = r.get(user_id)

    if not stored_credentials:
        return jsonify({"error": "User not linked"}), 400
    
    try:
        stored_credentials = json.loads(stored_credentials)  # Convert JSON string to dict
        credentials = Credentials.from_authorized_user_info(stored_credentials)
    except Exception as e:
        return jsonify({"error": "Invalid credentials format", "details": str(e)}), 500

    youtube = build("youtube", "v3", credentials=credentials)

    # Get the user's channel details
    channel_request = youtube.channels().list(part="contentDetails", mine=True)
    channel_response = channel_request.execute()
    uploads_playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

    # Get videos from the user's uploads playlist
    playlist_request = youtube.playlistItems().list(
        part="snippet",
        playlistId=uploads_playlist_id,
        maxResults=10
    )
    playlist_response = playlist_request.execute()

    # print(playlist_response)

    return jsonify(playlist_response)


@youtube_routes.route("/upload", methods=["POST"])
@jwt_required()
def upload_video():
    """Upload a video to the user's YouTube channel."""
    user_id = get_jwt_identity()
    stored_credentials = r.get(user_id)

    if not stored_credentials:
        return jsonify({"error": "User not linked"}), 400

    try:
        stored_credentials = json.loads(stored_credentials)  # Convert JSON string to dict
        credentials = Credentials.from_authorized_user_info(stored_credentials)
    except Exception as e:
        return jsonify({"error": "Invalid credentials format", "details": str(e)}), 500

    youtube = build("youtube", "v3", credentials=credentials)

    # Get the user's channel details
    channel_request = youtube.channels().list(part="contentDetails", mine=True)
    channel_response = channel_request.execute()
    uploads_playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

    # print(uploads_playlist_id)

    # print(request.json)
    video = request.files["file"]

    file_path = os.path.join('/tmp', video.filename)
    video.save(file_path)

    # Upload video
    # request_data = request.get_json()
    # video_title = request_data.get("title")
    # video_description = request_data.get("description")
    # privacy_status = request_data.get("privacyStatus")
    # # video_path = request_data.get("file")
    video_title = request.form.get("title")
    video_description = request.form.get("description")
    privacy_status = request.form.get("privacyStatus")

    print(video_title, "\n", video_description, "\n", privacy_status)
    print(file_path)

    if not video_title or not video_description or not file_path or not privacy_status:
        return jsonify({"error": "Missing required fields"}), 400

    request_body = {
        "snippet": {
            "title": video_title,
            "description": video_description
        },
        "status": {
            "privacyStatus": privacy_status
        }
    }

    media_file = MediaFileUpload(file_path)
    insert_request = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=media_file
    )
    response = insert_request.execute()

    return jsonify(response)

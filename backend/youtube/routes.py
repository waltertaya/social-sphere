from flask import redirect, url_for, session, request, Blueprint, jsonify
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv
import google.oauth2.credentials

from flask_jwt_extended import jwt_required, get_jwt_identity
import secrets

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
    redirect_uri="http://localhost:8080/api/v2/youtube/callback"  # Make sure this matches in your client_secret.json
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


# check the status of the user
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
    if "credentials" not in session:
        return redirect(url_for("login"))

    credentials = google.oauth2.credentials.Credentials(**session["credentials"])
    youtube = build("youtube", "v3", credentials=credentials)

    # Get the user's channel details
    channel_request = youtube.channels().list(part="contentDetails", mine=True)
    channel_response = channel_request.execute()
    uploads_playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

    # Get videos from the user's uploads playlist
    playlist_request = youtube.playlistItems().list(
        part="snippet",
        playlistId=uploads_playlist_id,
        maxResults=10  # Number of videos to fetch
    )
    playlist_response = playlist_request.execute()

    return jsonify(playlist_response)



from flask import redirect, url_for, session, request, Blueprint, jsonify
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
import json
import google.oauth2.credentials

youtube_routes = Blueprint('youtube_routes', __name__)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # For local testing only

# Load client secrets file
CLIENT_SECRETS_FILE = "client_secret.json"

# Define OAuth scopes
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

# Initialize Flow
flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=SCOPES,
    redirect_uri="http://localhost:8080/callback"  # Make sure this matches in your client_secret.json
)

@youtube_routes.route("/auth", methods=["GET"])
def login():
    """Generate the Google OAuth2 URL and send it to the frontend."""
    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true", prompt="consent"
    )
    session["state"] = state
    return jsonify({"auth_url": authorization_url})

@youtube_routes.route("/callback", methods=["GET"])
def callback():
    """Handle the OAuth 2.0 server's response."""
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials

    # Save credentials in session
    session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }

    return jsonify({"msg": "YouTube account linked successfully!"})

@youtube_routes.route("/videos", methods=["GET"])
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

@youtube_routes.route("/logout", methods=["GET"])
def logout():
    """Logout the user and clear session."""
    session.clear()
    return jsonify({"message": "User logged out successfully!"})

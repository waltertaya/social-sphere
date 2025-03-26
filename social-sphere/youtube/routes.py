from flask import redirect, url_for, session, request, Blueprint
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


@youtube_routes.route("/auth")
def login():
    """Redirect to Google's OAuth 2.0 server."""
    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true", prompt="consent"
    )
    # Save state in session for later verification
    session["state"] = state
    return redirect(authorization_url)


@youtube_routes.route("/callback")
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

    return redirect(url_for("get_videos"))


@youtube_routes.route("/videos")
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

    # Display video details
    video_list = []
    print(playlist_response)
    for item in playlist_response["items"]:
        title = item["snippet"]["title"]
        video_id = item["snippet"]["resourceId"]["videoId"]
        video_list.append(f"<li><a href='https://www.youtube.com/watch?v={video_id}'>{title}</a></li>")

    return f"<h1>Your Uploaded Videos:</h1><ul>{''.join(video_list)}</ul>"


@youtube_routes.route("/logout")
def logout():
    """Logout the user and clear session."""
    session.clear()
    return redirect(url_for("home"))

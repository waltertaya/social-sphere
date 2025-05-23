from flask import Flask, render_template
from dotenv import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from youtube.routes import youtube_routes
from generate_posts.routes import generate_posts_routes
from config import Config

import os


if __name__ == '__main__':
    load_dotenv()
    app = Flask(__name__)

    app.secret_key = os.getenv('SECRET_KEY')
    app.config.from_object(Config)

    CORS(app)

    JWTManager(app)
    
    app.register_blueprint(youtube_routes, url_prefix='/api/v2/bd/youtube')
    app.register_blueprint(generate_posts_routes, url_prefix='/api/v2/bd/chat-completion')

    app.run(port=os.getenv('PORT'), host=os.getenv('HOST'), debug=os.getenv('DEBUG'))

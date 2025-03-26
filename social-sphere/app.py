from flask import Flask, render_template
from dotenv import load_dotenv
from flask_cors import CORS

from youtube.routes import youtube_routes

import os


if __name__ == '__main__':
    load_dotenv()
    app = Flask(__name__)

    app.secret_key = os.getenv('SECRET_KEY')

    CORS(app)
    
    app.register_blueprint(youtube_routes)

    app.run(port=os.getenv('PORT'), host=os.getenv('HOST'), debug=os.getenv('DEBUG'))

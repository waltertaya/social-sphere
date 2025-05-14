from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

import os
from dotenv import load_dotenv

from config import Config
from api import db
from api.routes import auth_blueprint

if __name__ == '__main__':
    load_dotenv()
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)
    JWTManager(app)
    db.init_app(app)

    with app.app_context():
        from api.models import User

        db.create_all()
    
    app.register_blueprint(auth_blueprint, url_prefix='/api/v2/auth')

    app.run(port=os.getenv('PORT'), host=os.getenv('HOST'), debug=os.getenv('DEBUG'))

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token, create_refresh_token

from api import db
from api.models import User
from api.utils import hashing_password, compare_password


auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json

    user_exist = User.query.filter_by(username=data['username']).first()
    if user_exist:
        return jsonify({'msg': 'User already exists'}), 400

    hashed_password = hashing_password(data['password'])    

    user = User(
        username=data['username'],
        password=hashed_password,
        email=data['email']
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        'msg': 'User registered successfully'
    }), 200

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json

    username = data.get('username')
    password = data.get('password')

    if not password or not username:
        return jsonify({
            'msg': 'Details required'
        }), 400
    
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({
            'msg': 'Wrong credentials'
        }), 400
    
    # compare password
    hashed_pswd = user.password
    if not compare_password(hashed_pswd, password):
        return jsonify({
            'msg': 'Invalid credentials'
        }), 400
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'msg': 'login successfully',
        'access_token': access_token,
        'refresh_token': refresh_token
    })

@auth_blueprint.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify({
        'access_token': access_token
    })

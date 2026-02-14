"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not email or not password:
        return jsonify({'error': 'Required email and password'}), 400
    
    user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user:
        return jsonify({'error': 'Email already exist'}), 400
    new_user = User(email = email, username = username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'User create successfully'}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error':'Invalid email or password'}), 401
    
    user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
    
    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    if user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'msg':'Login successfully',
                        'token': access_token,
                        'user': user.serialize()}), 200,
                        
    return jsonify({'error':'Invalid email or password'}), 401

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({'error': 'Not found'}), 400
    return jsonify(user.serialize()) 

@api.route("/edit", methods=["PUT"])
@jwt_required()
def edit_profile():

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    data = request.get_json()
    new_password = data.get('password')
    new_username = data.get('username')
    new_avatar = data.get('avatar')

    if new_username != user.username:
        username_exits = db.session.execute(select(User).where(User.username==new_username)).scalar_one_or_none()
        if username_exits:
            return jsonify({'error': 'Username already exist'}), 400
        user.username= new_username
        
    if new_password: 
        user.set_password(new_password)

    if new_avatar:
        user.avatar= new_avatar

    db.session.commit()
    return jsonify({'msg': 'Save change successfully'}), 201

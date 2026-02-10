"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token

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
    user_name = data.get('user_name')

    if not email or not password:
        return jsonify({'error': 'Required email and password'}), 400
    
    user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user:
        return jsonify({'error': 'Email already exist'}), 400
    new_user = User(email = email, user_name = user_name)
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
                        'token': access_token}), 200
    return jsonify({'error':'Invalid email or password'}), 401

# @api.route('/profile', methods=['GET'])


    
    
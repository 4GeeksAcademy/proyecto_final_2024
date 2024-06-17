"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
jwt = JWTManager(api) 

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/imagen', methods=['POST'])
def upload_file():
    data = request.get_json()
    if 'url' not in data or 'id' not in data:
        return jsonify({"error": "No URL or ID provided"}), 400

    user_id = data['id']
    url = data['url']

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.profile_picture_url = url
    db.session.commit()
    
    return jsonify({"message": "Profile picture updated successfully", "user": user.serialize()}), 200

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg": "user not found"}), 404
    valid_password =    (user.password, password)
    # current_app.bcrypt.check_password_hash
    # (user.password, password)
    # # 
    if valid_password is False:
        return jsonify({"msg": "invalid password"}), 401
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token, user=user.serialize()), 200

@api.route("/private", methods=["GET"])
@jwt_required()
def get_user_data():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg": "user not found"}), 404
    return jsonify({"user": user.serialize()}), 200
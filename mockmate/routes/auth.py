from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from email_validator import validate_email, EmailNotValidError
from ..extensions import mongo, bcrypt
from datetime import datetime
import os

bp = Blueprint("auth", __name__)

@bp.post("/signup")
def signup():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    # new: role + admin_secret for safe admin creation
    role = (data.get("role") or "user").strip().lower()
    admin_secret_provided = (data.get("admin_secret") or "").strip()
    ADMIN_SECRET = os.getenv("ADMIN_SECRET", "")

    if not email or not password:
        return jsonify(error="Email and password are required"), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify(error="Invalid email format"), 400

    if len(password) < 8:
        return jsonify(error="Password must be at least 8 characters"), 400

    # only allow creating an admin if ADMIN_SECRET (env) is set and matches
    if role == "admin":
        if not ADMIN_SECRET or admin_secret_provided != ADMIN_SECRET:
            return jsonify(error="Invalid admin creation secret"), 403

    users = mongo.db.users
    if users.find_one({"email": email}):
        return jsonify(error="Email already registered"), 409

    # Hash password
    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    users.insert_one({
        "email": email,
        "password": hashed,
        "first_name": first_name,
        "last_name": last_name,
        "role": role,                   # NEW
        "created_at": datetime.utcnow(),
    })

    return jsonify(message="Signup successful"), 201


@bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify(error="Email and password are required"), 400

    users = mongo.db.users
    user = users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user.get("password", ""), password):
        return jsonify(error="Invalid credentials"), 401

    users.update_one({"email": email}, {"$set": {"last_login": datetime.utcnow()}})

    token = create_access_token(identity=email)
    resp = jsonify(message="Login successful", user={
        "email": email,
        "first_name": user.get("first_name", ""),
        "last_name": user.get("last_name", ""),
    })
    set_access_cookies(resp, token)
    return resp


@bp.post("/logout")
def logout():
    resp = jsonify(message="Logged out")
    unset_jwt_cookies(resp)
    return resp

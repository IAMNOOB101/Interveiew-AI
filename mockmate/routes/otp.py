from flask import Blueprint, request, jsonify
from ..services.email_service import send_otp
from ..services.otp_service import generate_otp, store_otp, verify_and_consume_otp

bp = Blueprint("otp", __name__)

@bp.post("/forgot_password")
def forgot_password():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        return jsonify(error="Email required"), 400
    code = generate_otp()
    store_otp(email, code)
    send_otp(email, code)
    return jsonify(message="OTP sent")

@bp.post("/verify_otp")
def verify_otp():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    code = (data.get("otp") or "").strip()
    ok = verify_and_consume_otp(email, code)
    if not ok:
        return jsonify(error="Invalid or expired OTP"), 400
    return jsonify(message="OTP verified")

@bp.post("/reset_password")
def reset_password():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    code = (data.get("otp") or "").strip()
    new_password = (data.get("new_password") or "").strip()

    if len(new_password) < 8:
        return jsonify(error="Password must be at least 8 characters"), 400
    if not verify_and_consume_otp(email, code):
        return jsonify(error="Invalid or expired OTP"), 400

    from ..extensions import mongo, bcrypt
    hashed = bcrypt.generate_password_hash(new_password).decode()
    mongo.db.users.update_one({"email": email}, {"$set": {"password": hashed}})
    return jsonify(message="Password reset successful")
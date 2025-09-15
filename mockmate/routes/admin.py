# path: Mockmate/mockmate/routes/admin.py
from flask import Blueprint, jsonify, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo

bp = Blueprint("admin", __name__, template_folder="templates")

def _require_admin():
    identity = get_jwt_identity()
    user = mongo.db.users.find_one({"email": identity})
    if not user or user.get("role") != "admin":
        return None
    return user

@bp.get("/")
@jwt_required()
def admin_dashboard():
    if not _require_admin():
        return jsonify(error="Forbidden"), 403
    users = list(mongo.db.users.find({}, {"password": 0}))
    # convert _id to str for JSON/templating
    for u in users:
        u["_id"] = str(u.get("_id"))
    return render_template("admin/users.html", users=users)

@bp.get("/api/users")
@jwt_required()
def api_list_users():
    if not _require_admin():
        return jsonify(error="Forbidden"), 403
    users = list(mongo.db.users.find({}, {"password": 0}))
    for u in users:
        u["_id"] = str(u.get("_id"))
    return jsonify(users=users)

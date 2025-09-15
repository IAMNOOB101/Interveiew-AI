from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo
from ..models.role import get_roles, add_role, delete_role
from ..models.domain import get_domains, add_domain, delete_domain
from ..models.interview_type import get_interview_types, add_interview_type, delete_interview_type

bp = Blueprint('admin_config', __name__)

def _require_admin():
    identity = get_jwt_identity()
    user = mongo.db.users.find_one({"email": identity})
    if not user or user.get("role") != "admin":
        return None
    return user

# --- Roles ---
@bp.get('/api/admin/roles')
@jwt_required()
def list_roles():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    return jsonify(roles=get_roles())

@bp.post('/api/admin/roles')
@jwt_required()
def create_role():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify(error="Role name required"), 400
    add_role(name)
    return jsonify(message="Role added", name=name)

@bp.delete('/api/admin/roles')
@jwt_required()
def remove_role():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify(error="Role name required"), 400
    delete_role(name)
    return jsonify(message="Role deleted", name=name)

# --- Domains ---
@bp.get('/api/admin/domains')
@jwt_required()
def list_domains():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    return jsonify(domains=get_domains())

@bp.post('/api/admin/domains')
@jwt_required()
def create_domain():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify(error="Domain name required"), 400
    add_domain(name)
    return jsonify(message="Domain added", name=name)

@bp.delete('/api/admin/domains')
@jwt_required()
def remove_domain():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify(error="Domain name required"), 400
    delete_domain(name)
    return jsonify(message="Domain deleted", name=name)

# --- Interview Types ---
@bp.get('/api/admin/interview_types')
@jwt_required()
def list_interview_types():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    return jsonify(interview_types=get_interview_types())

@bp.post('/api/admin/interview_types')
@jwt_required()
def create_interview_type():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify(error="Interview type name required"), 400
    add_interview_type(name)
    return jsonify(message="Interview type added", name=name)

@bp.delete('/api/admin/interview_types')
@jwt_required()
def remove_interview_type():
    if not _require_admin():
        return jsonify(error="Admin required"), 403
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify(error="Interview type name required"), 400
    delete_interview_type(name)
    return jsonify(message="Interview type deleted", name=name)

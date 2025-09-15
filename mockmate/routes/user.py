from flask import Blueprint, request, jsonify
from ..extensions import mongo

bp = Blueprint('user', __name__)


@bp.get('/profile')
def get_profile():
	email = (request.args.get('email') or '').strip().lower()
	if not email:
		return jsonify(error='Email required'), 400
	user = mongo.db.users.find_one({'email': email}, {'_id': 0, 'password': 0})
	if not user:
		return jsonify(error='User not found'), 404
	return jsonify(user)


@bp.post('/profile')
def update_profile():
	data = request.get_json() or {}
	email = (data.get('email') or '').strip().lower()
	if not email:
		return jsonify(error='Email required'), 400
	mongo.db.users.update_one({'email': email}, {'$set': data}, upsert=True)
	return jsonify(message='Profile updated')



import os
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
import uuid

bp = Blueprint('files', __name__)


@bp.post('/upload_resume')
def upload_resume():
	if 'resume' not in request.files:
		return jsonify(error='No file uploaded'), 400
	file = request.files['resume']
	email = (request.form.get('email') or '').strip().lower()
	if file.filename == '':
		return jsonify(error='No selected file'), 400
	filename = secure_filename(f"{email}_{uuid.uuid4().hex[:8]}_{file.filename}")

	# If S3 configured, upload there
	s3_bucket = current_app.config.get('AWS_S3_BUCKET')
	s3_client = getattr(current_app, 's3_client', None)
	if s3_bucket and s3_client:
		try:
			s3_key = f"resumes/{filename}"
			s3_client.upload_fileobj(file.stream, s3_bucket, s3_key)
			url = f"https://{s3_bucket}.s3.{current_app.config.get('AWS_REGION')}.amazonaws.com/{s3_key}"
			return jsonify(message='Resume uploaded', filename=filename, url=url)
		except Exception as e:
			current_app.logger.exception('S3 upload failed, falling back to local storage')

	# Local fallback
	dest_folder = current_app.config.get('RESUME_UPLOAD_FOLDER', 'uploads/resumes')
	os.makedirs(dest_folder, exist_ok=True)
	dest = os.path.join(dest_folder, filename)
	file.save(dest)
	return jsonify(message='Resume uploaded', filename=filename)


@bp.get('/resume/<filename>')
def get_resume(filename):
	try:
		folder = current_app.config.get('RESUME_UPLOAD_FOLDER', 'uploads/resumes')
		return send_from_directory(folder, filename, as_attachment=True)
	except FileNotFoundError:
		return jsonify(error='File not found'), 404


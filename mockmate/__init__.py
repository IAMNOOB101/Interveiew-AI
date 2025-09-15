# path: Mockmate/mockmate/__init__.py
from datetime import datetime
import os
import logging
from flask import Flask
from dotenv import load_dotenv
from werkzeug.middleware.proxy_fix import ProxyFix

from .routes import public_static

from .config import config
from .extensions import mongo, bcrypt, jwt, cors


def create_app():
    load_dotenv()

    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config.from_object(config)

    # Respect reverse proxy headers in production
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)

    # --- Initialize Extensions ---
    try:
        mongo.init_app(app)
        bcrypt.init_app(app)
        jwt.init_app(app)
        cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    except Exception as e:
        app.logger.warning(f"Extension init failed: {e}")

    # Optionally create an admin user from env vars if provided
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
    if ADMIN_EMAIL and ADMIN_PASSWORD:
        try:
            if not mongo.db.users.find_one({"email": ADMIN_EMAIL}):
                hashed = bcrypt.generate_password_hash(ADMIN_PASSWORD).decode("utf-8")
                mongo.db.users.insert_one({
                    "email": ADMIN_EMAIL,
                    "password": hashed,
                    "first_name": "Admin",
                    "last_name": "",
                    "role": "admin",
                    "created_at": datetime.utcnow(),
                })
                app.logger.info("Admin user created at startup for %s", ADMIN_EMAIL)
        except Exception as exc:
            app.logger.warning("Could not create admin user at startup: %s", exc)

    # --- Observability (Sentry) ---
    dsn = app.config.get('SENTRY_DSN')
    if dsn:
        try:
            import importlib
            sentry_sdk = importlib.import_module('sentry_sdk')
            flask_integration = None
            try:
                mod = importlib.import_module('sentry_sdk.integrations.flask')
                flask_integration = getattr(mod, 'FlaskIntegration', None)
            except Exception:
                flask_integration = None

            integrations = [flask_integration()] if flask_integration else []
            sentry_sdk.init(dsn=dsn, integrations=integrations)
            app.logger.info('Sentry initialized')
        except Exception as e:
            app.logger.warning(f'Sentry init failed: {e}')

    # --- Fail fast in production: require secrets ---
    if app.config.get('ENV') == 'production':
        required = []
        if not app.config.get('SECRET_KEY') or app.config.get('SECRET_KEY') == 'change-me':
            required.append('SECRET_KEY')
        if not app.config.get('JWT_SECRET_KEY'):
            required.append('JWT_SECRET_KEY')
        if required:
            raise RuntimeError('Missing required production config: ' + ','.join(required))

    # Conditional AWS S3 client
    if app.config.get('AWS_S3_BUCKET') and app.config.get('AWS_ACCESS_KEY_ID'):
        try:
            import importlib
            boto3 = importlib.import_module('boto3')
            s3_client = boto3.client(
                's3',
                aws_access_key_id=app.config.get('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=app.config.get('AWS_SECRET_ACCESS_KEY'),
                region_name=app.config.get('AWS_REGION')
            )
            setattr(app, 's3_client', s3_client)
            app.logger.info('S3 client configured')
        except Exception as e:
            app.logger.warning(f'Could not configure S3 client: {e}')

    # --- Upload Directories ---
    os.makedirs(app.config.get("RESUME_UPLOAD_FOLDER", "uploads/resumes"), exist_ok=True)

    # --- MongoDB Indexes ---
    with app.app_context():
        db = mongo.db
        try:
            db.users.create_index([("email", 1)], unique=True)
            db.otp_codes.create_index([("createdAt", 1)], expireAfterSeconds=app.config.get("OTP_TTL_SECONDS", 300))
            db.answers.create_index([("email", 1), ("timestamp", -1)])
            db.questions.create_index([("role", 1), ("type", 1)])
        except Exception as e:
            app.logger.warning(f"Index creation skipped: {e}")

    # --- Blueprints ---
    from .routes import auth, otp, fileRoutes, interview, user, admin
    app.register_blueprint(auth.bp, url_prefix="/api")
    app.register_blueprint(otp.bp, url_prefix="/api")
    app.register_blueprint(fileRoutes.bp, url_prefix="/api")
    app.register_blueprint(interview.bp, url_prefix="/api")
    app.register_blueprint(user.bp, url_prefix="/api")
    app.register_blueprint(admin.bp, url_prefix="/admin")

    # Public pages (no auth)
    app.register_blueprint(public_static.bp, url_prefix="/static-page")
    from .routes import public
    app.register_blueprint(public.bp, url_prefix="")

    # --- Logging ---
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)

    # --- Health Check ---
    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app

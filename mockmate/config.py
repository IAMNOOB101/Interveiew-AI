import os
from dotenv import load_dotenv

load_dotenv()

def get_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).lower() in ("1", "true", "yes")

class Config:
    # --- Core ---
    SECRET_KEY = os.environ.get("SECRET_KEY")
    if not SECRET_KEY and os.environ.get("FLASK_ENV") == "production":
        raise ValueError("SECRET_KEY must be set in production")

    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/mockmate")
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "/tmp/uploads")
    MAX_CONTENT_LENGTH = int(os.environ.get("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))

    # --- OpenAI ---
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    # --- JWT / Sessions ---
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "super-jwt-secret")
    JWT_TOKEN_LOCATION = ("cookies",)
    JWT_COOKIE_SECURE = get_bool("JWT_COOKIE_SECURE", True)
    JWT_COOKIE_SAMESITE = os.environ.get("JWT_COOKIE_SAMESITE", "Lax")
    JWT_COOKIE_CSRF_PROTECT = get_bool("JWT_COOKIE_CSRF_PROTECT", True)

    # --- AWS / S3 ---
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
    AWS_S3_BUCKET = os.environ.get("AWS_S3_BUCKET", "")
    AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

    # --- Observability ---
    SENTRY_DSN = os.environ.get("SENTRY_DSN", "")
    ENV = os.environ.get("FLASK_ENV", "development")
    DEBUG = ENV != "production"

config = Config()

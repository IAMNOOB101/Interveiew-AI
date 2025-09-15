import random
from datetime import datetime, timedelta
from typing import Optional

from ..extensions import mongo


def generate_otp(length: int = 6) -> str:
    """Generate a numeric OTP of given length (default 6)."""
    start = 10 ** (length - 1)
    end = (10 ** length) - 1
    return str(random.randint(start, end))


def store_otp(email: str, code: str, ttl_seconds: int = 300) -> None:
    """Store OTP in `otp_codes` collection with creation time."""
    now = datetime.utcnow()
    mongo.db.otp_codes.update_one(
        {"email": email},
        {"$set": {"otp": code, "created_at": now}},
        upsert=True,
    )


def verify_and_consume_otp(email: str, code: str, window_seconds: int = 300) -> bool:
    rec = mongo.db.otp_codes.find_one({"email": email})
    if not rec:
        return False
    created = rec.get("created_at")
    if not created or (datetime.utcnow() - created).total_seconds() > window_seconds:
        return False
    if rec.get("otp") != code:
        return False
    mongo.db.otp_codes.delete_one({"email": email})
    return True

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

SENDER_EMAIL: Optional[str] = os.getenv('SMTP_USER')
SENDER_PASSWORD: Optional[str] = os.getenv('SMTP_PASS')


def send_otp(email: str, otp_code: str) -> bool:
    """Send OTP to `email`.

    Behavior:
    - If SMTP credentials are present, attempt to send via SMTP and return True on success.
    - If SMTP is not configured, log the OTP to stdout for development and return True.
    - If sending fails, return False.
    """
    # Development fallback: log if SMTP not configured
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print(f"[OTP] SMTP not configured — OTP for {email}: {otp_code}")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = email
        msg['Subject'] = 'Your OTP Code'
        body = f"Your OTP code is: {otp_code}\n\nDo not share this code with anyone."
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, email, msg.as_string())

        print(f"[OTP] Sent to {email}")
        return True
    except Exception as e:
        print(f"[OTP] Failed to send to {email}: {e}")
        return False
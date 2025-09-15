import os
import time
from typing import Optional
from openai import OpenAI, APIError #type: ignore

def get_openai_client() -> Optional[OpenAI]:
    """
    Returns OpenAI client if API key configured, else None.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)

def safe_openai_call(func, *args, retries=3, backoff=1, **kwargs):
    for attempt in range(1, retries + 1):
        try:
            return func(*args, **kwargs)
        except APIError as e:
            if attempt == retries:
                raise
            time.sleep(backoff * attempt)

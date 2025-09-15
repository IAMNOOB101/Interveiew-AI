# Mockmate/mockmate/services/question_service.py
import re
from typing import List
from utils.openai_client import get_openai_client, safe_openai_call
import os

MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")  # default

def _parse_numbered_list(text: str) -> List[str]:
    """
    Parse numbered (1., 2., ...) list into clean strings.
    """
    items = []
    for line in text.splitlines():
        line = line.strip()
        # accept "1.", "1)", "- " or plain lines
        m = re.match(r'^\s*(?:\d+[\.\)]\s+)?(.+)$', line)
        if m:
            content = m.group(1).strip()
            if content:
                items.append(content)
    # remove duplicates and empty
    return [i for i in items if i]

def generate_questions(topic: str, role: str = "", experience_level: str = "junior", count: int = 5) -> List[str]:
    """
    Ask OpenAI to create interview questions. Returns list of questions.
    """
    client = get_openai_client()
    if not client:
        raise RuntimeError("OpenAI API key is not configured. Set OPENAI_API_KEY in env.")

    prompt = (
        f"Generate {count} interview questions about {topic} "
        f"for the role '{role}' with {experience_level} experience. "
        "Return a numbered list."
    )

    def call():
        return client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are an expert technical interviewer who writes concise, clear interview questions."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.6,
            max_tokens=800,
        )

    response = safe_openai_call(call)
    if response is None or not hasattr(response, "choices") or not response.choices:
        raise RuntimeError("OpenAI response is empty or invalid.")
    text = response.choices[0].message.content
    questions = _parse_numbered_list(text)
    # ensure we return at most `count`
    return questions[:count]

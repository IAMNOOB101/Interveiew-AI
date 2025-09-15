# Mockmate/mockmate/services/ai_evaluation.py
import json
import re
from difflib import SequenceMatcher
from typing import Dict, Any
from utils.openai_client import get_openai_client, safe_openai_call
import os

MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")  


def _fallback_score(reference: str, user_answer: str) -> Dict[str, Any]:
    ratio = SequenceMatcher(None, reference.lower(), user_answer.lower()).ratio()
    score = int(round(ratio * 10))
    return {"score": score, "feedback": f"(fallback) Similarity score: {ratio:.2f}"}


def evaluate_answer(question: str, user_answer: str, reference_answer: str = "") -> Dict[str, Any]:
    client = get_openai_client()
    if not client:
        return _fallback_score(reference_answer or question, user_answer)

    system = (
        "You are an expert interviewer and grader. "
        "Given a question and a candidate answer, produce a JSON object with two keys: "
        "'score' (integer 0-10) and 'feedback' (string). Keep JSON strictly parseable."
    )
    user_prompt = (
        f"Question: {question}\n\n"
        f"Reference/expected answer (if any): {reference_answer}\n\n"
        f"Candidate answer: {user_answer}\n\n"
        "Return only valid JSON like: {\"score\": 7, \"feedback\": \"...\"}"
    )

    def call():
        return client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.0,
            max_tokens=300,
        )

    try:
        response = safe_openai_call(call)
        if (
            response is None or
            not hasattr(response, "choices") or
            not response.choices or
            not hasattr(response.choices[0], "message") or
            not hasattr(response.choices[0].message, "content")
        ):
            return _fallback_score(reference_answer or question, user_answer)
        raw = response.choices[0].message.content.strip()
        m = re.search(r"\{.*\}", raw, flags=re.S)
        json_text = m.group(0) if m else raw
        result = json.loads(json_text)
        score = max(0, min(10, int(result.get("score", 0))))
        feedback = str(result.get("feedback", "")).strip()
        return {"score": score, "feedback": feedback}
    except Exception:
        return _fallback_score(reference_answer or question, user_answer)

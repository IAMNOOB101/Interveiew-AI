from flask import Blueprint, request, jsonify, current_app
import os

bp = Blueprint('interview', __name__)
from ..models.role import get_roles
from ..models.domain import get_domains
from ..models.interview_type import get_interview_types
from ..extensions import mongo
from openai import OpenAI #type: ignore

bp = Blueprint('interview', __name__)
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# New endpoint: get available options
@bp.get('/api/interview/options')
def get_interview_options():
    return jsonify({
        "roles": get_roles(),
        "domains": get_domains(),
        "interview_types": get_interview_types()
    })


@bp.route('/generate-question', methods=['POST'])
def generate_question():
    data = request.get_json() or {}
    role = data.get('role', '')
    domain = data.get('domain', '')
    interview_type = data.get('interview_type', '')
    experience = data.get('experience', '')
    topic = data.get('topic', '')

    # Always use OpenAI to generate questions
    if OPENAI_API_KEY:
        try:
            client = OpenAI(api_key=OPENAI_API_KEY)
            prompt_parts = [f"Generate 8 interview questions for a {role} with {experience} experience."]
            if domain:
                prompt_parts.append(f"Target the questions to the domain: {domain}.")
            if interview_type:
                prompt_parts.append(f"Type: {interview_type}.")
            if topic:
                prompt_parts.append(f"Focus on: {topic}.")
            prompt = " ".join(prompt_parts)
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.7,
            )
            text = resp.choices[0].message.content
            lines = [ln.strip("- .\n") for ln in text.splitlines() if ln.strip()]
            questions = [ln for ln in lines if len(ln) > 10][:10]
            return jsonify({"questions": questions})
        except Exception as e:
            current_app.logger.exception("OpenAI generate-question failed")
            return jsonify({"error": "OpenAI generation failed", "details": str(e)}), 500

    # fallback if no key
    return jsonify({"questions": ["OpenAI API key not set. Cannot generate questions."]})


@bp.route('/evaluate-answer', methods=['POST'])
def evaluate_answer_route():
    data = request.get_json() or {}
    candidate_answer = data.get('answer', '')
    expected_answer = data.get('expected', '')
    keywords = data.get('keywords', [])
    # Always use OpenAI via ai_evaluation service
    from mockmate.services.ai_evaluation import evaluate_answer as local_eval
    result = local_eval(candidate_answer, expected_answer, keywords)
    return jsonify(result)
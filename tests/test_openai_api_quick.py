# path: tools/test_openai_endpoints.py
import os, requests, json

BASE = os.getenv("BASE_URL", "http://localhost:5000")

def test_generate():
    payload = {"role": "software developer", "experience": "2 years", "salary": "600000"}
    r = requests.post(BASE + "/api/generate-question", json=payload)
    print("generate-question:", r.status_code, r.text)

def test_evaluate():
    payload = {"answer": "This is my answer", "expected": "This is expected", "keywords": ["design","algo"]}
    r = requests.post(BASE + "/api/evaluate-answer", json=payload)
    print("evaluate-answer:", r.status_code, r.text)

if __name__ == "__main__":
    test_generate()
    test_evaluate()

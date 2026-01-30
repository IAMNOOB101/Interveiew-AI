import OpenAI from "openai";

let client = null;

const getAIClient = () => {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "InterviewAI Platform"
      }
    });
  }
  return client;
};

export const evaluateAnswer = async ({
  question,
  answer,
  domain,
  language,
  salaryRange
}) => {
  const ai = getAIClient();

  const prompt = `
You are an expert interview evaluator.

Evaluate the candidate's answer based on:
1. Technical correctness
2. Clarity of explanation
3. Confidence in expression
4. Relevance to the question
5. Speaking confidence
6. Hesitation or uncertainty
7. Fluency of speech
8. Alignment between spoken answer and question
9.Confidence in speech
10. Hesitation or uncertainity
11.Fluency of spoken language

Context:
- Domain: ${domain}
- Expected Salary: ${salaryRange.min}-${salaryRange.max} LPA
- Language: ${language}

Question:
"${question}"

Candidate Answer:
"${answer}"

Return the evaluation STRICTLY in JSON format:

{
  "contentScore": number (0-10),
  "clarityScore": number (0-10),
  "confidenceScore": number (0-10),
  "speechConfidenceScore": number (0-10),
  "fluencyScore": number (0-10),
  "overallScore": number (average),
  "strengths": [string],
  "improvements": [string],
  "finalFeedback": string
}

IMPORTANT:
- If language is not English, return feedback in that language
- Do NOT add any extra text outside JSON
`;

  const response = await ai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content);
};

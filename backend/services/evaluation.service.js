import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const evaluateAnswer = async ({
  question,
  answer,
  domain,
  language,
  salaryRange,
  confidenceSignals,
}) => {
  try {
    const prompt = `
You are an expert interview evaluator.

Question:
"${question}"

Answer:
"${answer}"

Evaluate based on:
- Technical correctness
- Clarity
- Confidence
- Relevance

Return ONLY valid JSON:
{
  "contentScore": number,
  "clarityScore": number,
  "confidenceScore": number,
  "overallScore": number,
  "strengths": [string],
  "improvements": [string]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error(" AI evaluation failed, using fallback:", err.message);

    // 🔒 FAIL-SAFE (DO NOT BREAK INTERVIEW)
    return {
      contentScore: 5,
      clarityScore: 5,
      confidenceScore: confidenceSignals?.voice ?? 5,
      overallScore: 5,
      strengths: ["Answer submitted"],
      improvements: ["AI evaluation unavailable"],
    };
  }
};

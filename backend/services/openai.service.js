import OpenAI from "openai";

let client = null;

const getAIClient = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing in .env");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173", // required by OpenRouter
        "X-Title": "InterviewAI Platform"
      }
    });
  }

  return client;
};

export const generateQuestion = async ({
  domain,
  experienceLevel,
  salaryRange,
  language
}) => {
  const ai = getAIClient();

  const prompt = `
You are an expert interview coach.

Generate ONE interview question based on:
- Role: ${domain}
- Experience: ${experienceLevel}
- Salary Range: ${salaryRange.min}-${salaryRange.max} LPA
- Language: ${language}

Rules:
- Ask only ONE question
- Adjust difficulty based on salary & experience
- If language is not English, respond in that language
`;

  const response = await ai.chat.completions.create({
    model: "openai/gpt-4o-mini", // ✅ OpenRouter model
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return response.choices[0].message.content;
};

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);


export const generateQuestion = async ({
  domain,
  experienceLevel,
  salaryRange,
  language = "en",
  previousAnswer = null,
  resumeText = null,
}) => {
  try {
    const prompt = `
You are a professional interview question generator.

Role: ${domain}
Experience: ${experienceLevel}
Salary Range: ${salaryRange?.min || "N/A"} - ${salaryRange?.max || "N/A"} LPA
Language: ${language}

${previousAnswer ? `Previous Answer: ${previousAnswer}` : ""}

Generate ONE concise interview question.
Only return the question text.
`;

    // If resume text is provided, append it to the prompt to make questions contextual
    const fullPrompt = resumeText ? `${prompt}\n\nResume:\n${resumeText}` : prompt;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.6,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("Question generation failed:", err.message);
    throw err;
  }
};

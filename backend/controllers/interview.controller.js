import User from "../models/User.model.js";
import { generateQuestion } from "../services/openai.service.js";

export const generateInterviewQuestion = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user?.interviewProfile) {
    return res.status(400).json({ message: "Interview profile not set" });
  }

  const question = await generateQuestion(user.interviewProfile);

  res.json({ question });
};

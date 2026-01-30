import User from "../models/User.model.js";
import InterviewAttempt from "../models/InterviewAttempt.model.js";
import { evaluateAnswer } from "../services/evaluation.service.js";

export const evaluateInterviewAnswer = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required" });
  }

  const user = await User.findById(req.user.id);

  const evaluation = await evaluateAnswer({
    question,
    answer,
    domain: user.interviewProfile.domain,
    language: user.interviewProfile.language,
    salaryRange: user.interviewProfile.salaryRange
  });

  // ✅ SAVE ATTEMPT
  const attempt = await InterviewAttempt.create({
    userId: user._id,
    domain: user.interviewProfile.domain,
    language: user.interviewProfile.language,
    salaryRange: user.interviewProfile.salaryRange,
    question,
    answer,
    evaluation
  });

  res.json({ evaluation, attemptId: attempt._id });
};

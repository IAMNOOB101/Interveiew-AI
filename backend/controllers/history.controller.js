import InterviewAttempt from "../models/InterviewAttempt.model.js";

export const getUserInterviewHistory = async (req, res) => {
  const history = await InterviewAttempt.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ history });
};

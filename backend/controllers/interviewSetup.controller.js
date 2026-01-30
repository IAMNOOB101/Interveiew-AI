import User from "../models/User.model.js";

export const setupInterviewProfile = async (req, res) => {
  const { domain, experienceLevel, salaryRange, language } = req.body;

  const userId = req.user.id;

  await User.findByIdAndUpdate(userId, {
    interviewProfile: {
      domain,
      experienceLevel,
      salaryRange,
      language
    }
  });

  res.json({ message: "Interview profile saved successfully" });
};

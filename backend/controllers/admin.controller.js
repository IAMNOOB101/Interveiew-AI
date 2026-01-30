import User from "../models/User.model.js";
import InterviewAttempt from "../models/InterviewAttempt.model.js";


// GET all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
};

// GET all interview attempts
export const getAllAttempts = async (req, res) => {
  const attempts = await InterviewAttempt.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json({ attempts });
};

// GET average scores (analytics)
export const getAnalytics = async (req, res) => {
  const analytics = await InterviewAttempt.aggregate([
    {
      $group: {
        _id: "$domain",
        avgContent: { $avg: "$evaluation.contentScore" },
        avgClarity: { $avg: "$evaluation.clarityScore" },
        avgConfidence: { $avg: "$evaluation.confidenceScore" },
        avgOverall: { $avg: "$evaluation.overallScore" }
      }
    }
  ]);

  res.json({ analytics });
};

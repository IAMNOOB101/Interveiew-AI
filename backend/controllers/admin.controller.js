import InterviewSession from "../models/InterviewSession.model.js";
import User from "../models/User.model.js";
import Institution from "../models/Institution.model.js";

export const getPlatformStats = async (req, res) => {
  // Admin-only guard assumed at route level
  const totalUsers = await User.countDocuments();
  const totalInterviews = await InterviewSession.countDocuments();
  const completedInterviews = await InterviewSession.countDocuments({
    completed: true,
  });

  const avgScoreAgg = await InterviewSession.aggregate([
    { $match: { completed: true, "finalReport.finalScore": { $exists: true } } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$finalReport.finalScore" },
      },
    },
  ]);

  const avgScore = avgScoreAgg[0]?.avgScore ?? 0;

  res.json({
    users: totalUsers,
    interviews: totalInterviews,
    completedInterviews,
    averageScore: avgScore.toFixed(2),
  });
};

export const getDomainWiseStats = async (req, res) => {
  const stats = await InterviewSession.aggregate([
    { $match: { completed: true } },
    {
      $group: {
        _id: "$domain",
        count: { $sum: 1 },
        avgScore: { $avg: "$finalReport.finalScore" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json(stats);
};

export const createInstitution = async (req, res) => {
  const { name, allowedDomains, perStudentPrice, studentLimit } = req.body;

  if (!name || !allowedDomains || !perStudentPrice || !studentLimit) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const institution = await Institution.create({
    name,
    allowedDomains,
    perStudentPrice,
    studentLimit
  });

  res.status(201).json(institution);
};

// Approve or reject institution

export const updateInstitutionStatus = async (req, res) => {
  const { institutionId } = req.params;
  const { status } = req.body;

  if (!["ACTIVE", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const institution = await Institution.findByIdAndUpdate(
    institutionId,
    { approvalStatus: status },
    { new: true }
  );

  if (!institution) {
    return res.status(404).json({ message: "Institution not found" });
  }

  res.json(institution);
};

// List all institutions

export const listInstitutions = async (req, res) => {
  const institutions = await Institution.find();
  res.json(institutions);
};
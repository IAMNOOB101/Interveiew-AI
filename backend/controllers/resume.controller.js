import User from "../models/User.model.js";
import { parseResume } from "../services/resumeParser.js";

export const uploadResume = async (req, res) => {
  const userId = req.user.id;
  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ message: "Resume text is required" });
  }

  const parsedResume = parseResume(resumeText);

  await User.findByIdAndUpdate(userId, {
    resumeData: parsedResume
  });

  res.json({
    message: "Resume uploaded and parsed successfully",
    resumeSummary: {
      hasSkills: !!parsedResume.skills,
      hasExperience: !!parsedResume.experience,
      hasProjects: !!parsedResume.projects
    }
  });
};

export const getResume = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user || !user.resumeData) {
    return res.status(404).json({ message: "Resume not found" });
  }

  res.json(user.resumeData);
};

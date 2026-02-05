export const parseResume = (resumeText) => {
  if (!resumeText || typeof resumeText !== "string") {
    throw new Error("Invalid resume content");
  }

  return {
    rawText: resumeText,

    skills: extractSection(resumeText, ["skills", "technical skills"]),
    experience: extractSection(resumeText, ["experience", "work experience"]),
    projects: extractSection(resumeText, ["projects"]),
    education: extractSection(resumeText, ["education"]),
    coScholastic: extractSection(resumeText, [
      "achievements",
      "certifications",
      "activities"
    ])
  };
};

const extractSection = (text, keywords) => {
  const lowerText = text.toLowerCase();

  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      return text.substring(index, index + 800); // safe slice
    }
  }

  return "";
};

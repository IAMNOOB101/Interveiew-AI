import InterviewSession from "../models/InterviewSession.model.js";
import User from "../models/User.model.js";
import { generateQuestion } from "../services/openai.service.js";
import { evaluateAnswer } from "../services/evaluation.service.js";

export const startInterview = async (req, res) => {
  const user = await User.findById(req.user.id);

  const questions = [];

  for (let i = 0; i < 5; i++) {
    const q = await generateQuestion(user.interviewProfile);
    questions.push({ questionText: q });
  }

  const session = await InterviewSession.create({
    userId: user._id,
    domain: user.interviewProfile.domain,
    language: user.interviewProfile.language,
    salaryRange: user.interviewProfile.salaryRange,
    questions
  });

  res.json({
    sessionId: session._id,
    question: questions[0].questionText
  });
};

export const submitAnswer = async (req, res) => {
  const { sessionId, answerText } = req.body;

  const session = await InterviewSession.findById(sessionId);
  const index = session.currentQuestionIndex;

  // Save answer
  session.questions[index].answerText = answerText;

  // AI evaluation for this answer
  const evaluation = await evaluateAnswer({
    question: session.questions[index].questionText,
    answer: answerText,
    domain: session.domain,
    language: session.language,
    salaryRange: session.salaryRange
  });

  session.questions[index].evaluation = evaluation;

  session.currentQuestionIndex += 1;

  // INTERVIEW COMPLETED
  if (session.currentQuestionIndex >= session.questions.length) {
    session.completed = true;
    const total = session.questions.reduce(
      (acc, q) => acc + q.evaluation.overallScore,
      0
    );

    const avgScore = total / session.questions.length;

    let confidenceLevel = "Low";
    if (avgScore >= 7) confidenceLevel = "High";
    else if (avgScore >= 5) confidenceLevel = "Medium";

    session.finalReport = {
      finalScore: avgScore.toFixed(2),
      confidenceLevel,
      strengths: ["Good conceptual understanding"],
      weaknesses: ["Needs better communication clarity"],
      cheatingFlags: []
    };
  }

  await session.save();

  res.json({
    completed: session.completed,
    nextQuestion: session.completed
      ? null
      : session.questions[session.currentQuestionIndex].questionText,
    finalReport: session.completed ? session.finalReport : null
  });
};

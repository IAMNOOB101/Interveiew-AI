import InterviewSession from "../models/InterviewSession.model.js";
import User from "../models/User.model.js";
import { generateQuestion } from "../services/openai.service.js";
import { evaluateAnswer } from "../services/evaluation.service.js";
import { sendInterviewCompletionEmail } from "../services/email.service.js";

export const startInterview = async (req, res) => {
  console.log(" startInterview controller executing");

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // BLOCK STUDENT / PROFESSIONAL WITHOUT RESUME
  if (user.accountType !== "guest") {
    if (!user.resumeData || !user.resumeData.rawText) {
      return res.status(400).json({
        message: "Please upload your resume before starting an interview"
      });
    }
  }

  // REQUIRE INTERVIEW PROFILE INPUTS
  if (
    !user.interviewProfile ||
    !user.interviewProfile.domain ||
    !user.interviewProfile.experienceLevel
  ) {
    return res.status(400).json({
      message:
        "Interview profile incomplete. Please select domain and experience level."
    });
  }

  // GUEST LIMIT DOUBLE CHECK
  if (user.accountType === "guest" && user.interviewCount >= 1) {
    return res.status(403).json({
      message: "Guest interview limit reached"
    });
  }

  const activeSession = await InterviewSession.findOne({
    userId: user._id,
    completed: false,
  });

  if (activeSession) {
    return res.json({
      sessionId: activeSession._id,
      question:
        activeSession.questions[activeSession.currentQuestionIndex]
          ?.questionText || null,
      resumed: true,
    });
  }

  const questions = [];

  // Generate initial questions using resume + interview profile
  const resumeText = user.resumeData?.rawText || null;
  try {
    for (let i = 0; i < 5; i++) {
      console.log("🧠 Generating question", i + 1);
      try {
        const q = await generateQuestion({
          domain: user.interviewProfile.domain,
          experienceLevel: user.interviewProfile.experienceLevel,
          salaryRange: user.interviewProfile.salaryRange,
          language: user.interviewProfile.language || "en",
          resumeText,
        });
        questions.push({ questionText: q });
      } catch (err) {
        console.warn("Question generation failed, falling back", err?.message);
        questions.push({ questionText: `Tell me about your experience related to ${user.interviewProfile.domain} (Q ${i + 1})` });
      }
    }
  } catch (err) {
    // fallback simple questions
    console.error("Bulk question generation failed, using fallbacks", err?.message);
    for (let i = 0; i < 5; i++) {
      questions.push({ questionText: `TEMP QUESTION ${i + 1}` });
    }
  }

  // CREATE SESSION IN DB
  const session = await InterviewSession.create({
    userId: user._id,
    domain: user.interviewProfile?.domain,
    language: user.interviewProfile?.language || "en",
    salaryRange: user.interviewProfile?.salaryRange,
    questions,
    completed: false,
    currentQuestionIndex: 0,
  });

  return res.json({
    sessionId: session._id,
    question: session.questions[0].questionText,
  });
};


export const submitAnswer = async (req, res) => {
  const { sessionId, answerText, confidence } = req.body;
  
  console.log(" submitAnswer HIT", {
    sessionId,
    answerLength: answerText?.length,
  });

  console.log("submitAnswer called", {
    sessionId,
    answerTextLength: answerText?.length,
  });

  const session = await InterviewSession.findById(sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const user = await User.findById(req.user.id);

  // Prevent other users from answering
  if (session.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Prevent answering after completion
  if (session.completed) {
    return res.status(400).json({
      message: "Interview already completed",
    });
  }

  const index = session.currentQuestionIndex;
  console.log(" Current index:", session.currentQuestionIndex);
  console.log(" Total questions:", session.questions.length);

  // Save answer
  session.questions[index].answerText = answerText;
  session.questions[index].answeredAt = new Date();

  if (confidence) {
    session.questions[index].confidenceSignals = {
      voice: typeof confidence.voice === "number" ? confidence.voice : null,
      facial: typeof confidence.facial === "number" ? confidence.facial : null,
    };
  }

  console.log("➡️ Next index:", session.currentQuestionIndex);


  // AI evaluation for this answer
  const evaluation = await evaluateAnswer({
    question: session.questions[index].questionText,
    answer: answerText,
    domain: session.domain,
    language: session.language,
    salaryRange: session.salaryRange,
    confidenceSignals: session.questions[index].confidenceSignals,
  });

  const shouldFollowUp = evaluation.overallScore >= 6 && Math.random() > 0.5;
  // If follow-up needed, generate and insert it next
  if (!session.completed && shouldFollowUp) {
    try {
      const followUp = await generateQuestion({
        domain: session.domain,
        experienceLevel: user.interviewProfile.experienceLevel,
        salaryRange: session.salaryRange,
        previousAnswer: answerText,
        language: session.language,
        resumeText: user.resumeData?.rawText || null,
      });
      session.questions.push({
        questionText: followUp,
        topic: "follow-up",
      });
    } catch (err) {
      console.warn("Follow-up generation failed", err?.message);
    }
  }

  session.questions[index].evaluation = evaluation;

  session.currentQuestionIndex += 1;

  // INTERVIEW COMPLETED
  if (
    session.currentQuestionIndex >= session.questions.length ||
    session.questions.length >= 25
  ) {
    session.completed = true;
    session.transcriptLocked = true;
    const total = session.questions.reduce(
      (acc, q) => acc + q.evaluation.overallScore,
      0,
    );

    const avgScore = total / session.questions.length;

    // if(session.transcriptLocked) {
    //   return res.status(400).json({
    //     message: "Transcript is locked. No further changes allowed.",
    //   });
    // }

    let confidenceLevel = "Low";
    if (avgScore >= 7) confidenceLevel = "High";
    else if (avgScore >= 5) confidenceLevel = "Medium";

    const allCompleted = await InterviewSession.find({ userId: user._id, completed: true });
    const previous = allCompleted
      .filter((s) => s._id.toString() !== session._id.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    let progressInsight = null;

    if (previous && previous.finalReport?.finalScore) {
      const prevScore = parseFloat(previous.finalReport.finalScore);
      const diff = avgScore - prevScore;

      if (diff > 0.5) {
        progressInsight = `Great job! Your score improved by ${diff.toFixed(2)} points since your last interview.`;
      } else if (diff < -0.5) {
        progressInsight = `It seems your score dropped by ${Math.abs(diff).toFixed(2)} points since your last interview. Consider reviewing your previous feedback.`;
      } else {
        progressInsight = `Your score remained consistent with a slight change of ${diff.toFixed(2)} points since your last interview. Keep up the steady work!`;
      }
    }

    session.finalReport = {
      finalScore: avgScore.toFixed(2),
      confidenceLevel,
      strengths: ["Good conceptual understanding"],
      weaknesses: ["Needs better communication clarity"],
      cheatingFlags: [],
      progressInsight,
    };
    // Increment guest interview count AFTER successful completion
    if (user.accountType === "guest") {
      await User.findByIdAndUpdate(user._id, {
        interviewCount: (user.interviewCount || 0) + 1,
      });
    }
    try {
      await sendInterviewCompletionEmail({
        to: user.email,
        name: user.name,
        sessionId: session._id,
        performanceCategory: session.finalReport.confidenceLevel,
      });
    } catch (error) {
      console.error("Email Failed", error.message);
    }
  }

  await session.save();

  res.json({
    completed: session.completed,
    nextQuestion: session.completed
      ? null
      : session.questions[session.currentQuestionIndex].questionText,
    finalReport: session.completed ? session.finalReport : null,
  });
};

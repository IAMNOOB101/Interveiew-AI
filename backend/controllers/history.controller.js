import InterviewSession from "../models/InterviewSession.model.js";

export const getInterviewTranscript = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (isNaN(Number(sessionId))) {
      return res.status(400).json({ message: "Invalid interview ID" });
    }

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Ownership check
    const effectiveUserId = req.impersonatedUserId || req.user.id;
    if (session.userId.toString() !== effectiveUserId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "guest") {
      const list = await InterviewSession.find({ userId: req.user.id });
      const sorted = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestSession = sorted[0];

      if (!latestSession || latestSession._id.toString() !== sessionId) {
        return res.status(403).json({
          message: "Guest users can view only their latest interview",
        });
      }
    }
    
    res.json({
      sessionId: session._id,
      startedAt: session.createdAt,
      completedAt: session.updatedAt,
      transcript: session.questions.map((q) => ({
        question: q.questionText,
        answer: q.answerText,
        askedAt: q.askedAt,
        answeredAt: q.answeredAt,
      })),
      finalReport: session.finalReport,
    });
  } catch (err) {
    next(err);
  }
};

export const getInterviewHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sessions = await InterviewSession.find({ userId, completed: true });
    const sorted = sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      count: sorted.length,
      interviews: sorted.map((s) => ({
        sessionId: s._id,
        date: s.createdAt,
        score: s.finalReport?.finalScore || null,
        confidenceLevel: s.finalReport?.confidenceLevel || null,
      })),
    });
  } catch (err) {
    next(err);
  }
};

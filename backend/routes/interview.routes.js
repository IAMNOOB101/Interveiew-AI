import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { startInterview, submitAnswer } from "../controllers/session.controller.js";
import { getInterviewHistory, getInterviewTranscript } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/history", verifyToken, getInterviewHistory);
router.get("/:sessionId", verifyToken, getInterviewTranscript);

router.post("/session/start", verifyToken, startInterview);
router.post("/session/submit", verifyToken, submitAnswer);

export default router;

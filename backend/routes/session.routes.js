import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  startInterview,
  submitAnswer,
} from "../controllers/session.controller.js";

const router = express.Router();

router.post("/start", verifyToken, startInterview);
router.post("/submit", verifyToken, submitAnswer);
router.get("/report/:sessionId", verifyToken, async (req, res) => {
  const session = await InterviewSession.findById(req.params.sessionId);
  res.json({ report: session.finalReport });
});

export default router;

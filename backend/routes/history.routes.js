import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getInterviewTranscript } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/:sessionId", verifyToken, getInterviewTranscript);

export default router;

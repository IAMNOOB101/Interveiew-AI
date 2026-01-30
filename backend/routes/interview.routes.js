import express from "express";
import { generateInterviewQuestion } from "../controllers/interview.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate-question", verifyToken, generateInterviewQuestion);

export default router;

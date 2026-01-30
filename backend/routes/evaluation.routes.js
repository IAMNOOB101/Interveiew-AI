import express from "express";
import { evaluateInterviewAnswer } from "../controllers/evaluation.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/evaluate", verifyToken, evaluateInterviewAnswer);

export default router;

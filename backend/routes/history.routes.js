import express from "express";
import { getUserInterviewHistory } from "../controllers/history.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", verifyToken, getUserInterviewHistory);

export default router;

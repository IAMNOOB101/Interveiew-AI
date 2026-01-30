import express from "express";
import { setupInterviewProfile } from "../controllers/interviewSetup.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/setup", verifyToken, setupInterviewProfile);

export default router;

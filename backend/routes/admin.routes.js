import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import {
  getAllUsers,
  getAllAttempts,
  getAnalytics
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/attempts", verifyToken, verifyAdmin, getAllAttempts);
router.get("/analytics", verifyToken, verifyAdmin, getAnalytics);

export default router;

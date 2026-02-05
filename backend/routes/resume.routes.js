import express from "express";
import { uploadResume, getResume } from "../controllers/resume.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(allowRoles("student", "professional", "admin"));

router.post("/upload", uploadResume);
router.get("/", getResume);

export default router;

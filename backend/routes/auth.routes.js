import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

let uploadMiddleware = (req, res, next) => next();
try {
  // prefer memory storage for small PDF uploads
  const multerModule = await import("multer");
  const multer = multerModule.default;
  const storage = multer.memoryStorage();
  uploadMiddleware = multer({ storage }).single("resume");
} catch (err) {
  console.warn("multer not installed — resume upload will be ignored");
}

const router = express.Router();

router.post("/register", uploadMiddleware, register);
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

export default router;

import express from "express";
import { resetPassword } from "../controllers/password.controller.js";

const router = express.Router();

router.post("/reset", resetPassword);

export default router;

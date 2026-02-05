import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import interviewSetupRoutes from "./routes/interviewSetup.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import historyRoutes from "./routes/history.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./middleware/logger.middleware.js";
import resumeRoutes from "./routes/resume.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if(process.env.NODE_ENV !== "production"){
  app.use(logger);
}

app.use(errorHandler);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewSetupRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/interview", evaluationRoutes);
app.use("/api/interview", historyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/interview/session", sessionRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/payments", paymentRoutes);

// test route
app.get("/", (req, res) => {
  res.send("InterviewAI Backend Running");
});

export default app;



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
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewSetupRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/interview", evaluationRoutes);
app.use("/api/interview", historyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/interview/session", sessionRoutes);

// test route
app.get("/", (req, res) => {
  res.send("InterviewAI Backend Running");
});

export default app;



import mongoose from "mongoose";

const interviewAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    domain: String,
    language: String,

    salaryRange: {
      min: Number,
      max: Number
    },

    question: String,
    answer: String,

    evaluation: {
      contentScore: Number,
      clarityScore: Number,
      confidenceScore: Number,
      overallScore: Number,
      strengths: [String],
      improvements: [String],
      finalFeedback: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("InterviewAttempt", interviewAttemptSchema);

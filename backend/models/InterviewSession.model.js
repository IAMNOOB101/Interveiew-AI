import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    domain: String,
    language: String,

    salaryRange: {
      min: Number,
      max: Number,
    },

    questions: [
      {
        questionText: String,
        answerText: String,
        audioTranscript: String,
        evaluation: Object,
      },
    ],

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },
    finalReport: {
      finalScore: Number,
      confidenceLevel: String,
      strengths: [String],
      weaknesses: [String],
      cheatingFlags: [String],
    }
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);

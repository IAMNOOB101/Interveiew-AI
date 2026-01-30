import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    interviewProfile: {
      domain: {
        type: String,
        enum: [
          "software_engineer",
          "backend_developer",
          "frontend_developer",
          "intern",
          "data_analyst",
          "full-stack_developer",
          "devops_engineer",
          "product_manager",
        ],
      },
      experienceLevel: {
        type: String,
        enum: ["fresher", "experienced"],
      },
      salaryRange: {
        min: Number,
        max: Number,
      },
      language: {
        type: String,
        default: "en",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

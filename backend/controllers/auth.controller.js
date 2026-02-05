import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Institution from "../models/Institution.model.js";
import { parseResume } from "../services/resumeParser.js";

const getEmailDomain = (email) => email.split("@")[1];

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      accountType = "professional",
      resumeText,
      experience,
      salaryRange,
      domain,
      role,
    } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // STUDENT INSTITUTION CHECK
  if (accountType === "student") {
    const domain = getEmailDomain(email);

    const institution = await Institution.findOne({
      allowedDomains: domain,
      approvalStatus: "ACTIVE",
    });

    if (!institution) {
      return res.status(403).json({
        message:
          "Email domain not allowed or institution not approved. Please contact your institution administrator.",
      });
    }

    if (institution.studentsRegistered >= institution.studentLimit) {
      return res.status(403).json({
        message:
          "Student limit for the institution reached. Please contact your institution administrator.",
      });
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Build interviewProfile from provided fields
  const interviewProfile = {
    domain: domain || (req.body.domain ?? null),
    experienceLevel: experience || (req.body.experience ?? null),
    salaryRange: salaryRange || (req.body.salaryRange ?? null),
    role: role || (req.body.role ?? null),
  };

  // Parse resume if provided
  let parsedResume = null;
  // If a file upload was provided (multer memoryStorage), parse PDF buffer
  if (req.file && req.file.buffer) {
    try {
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = pdfParseModule.default || pdfParseModule;
      const pdfResult = await pdfParse(req.file.buffer);
      const text = pdfResult?.text || "";
      parsedResume = parseResume(text);
    } catch (err) {
      console.warn("PDF parse failed or pdf-parse not installed", err?.message || err);
      // fallback: save minimal info
      parsedResume = { filename: req.file.originalname, size: req.file.size };
    }
  } else if (resumeText) {
    try {
      parsedResume = parseResume(resumeText);
    } catch (err) {
      parsedResume = { rawText: resumeText };
    }
  }

    const user = await User.create({
    name,
    email,
    password: hashedPassword,
    accountType,
    role: accountType, // legacy support
    interviewProfile,
    resumeData: parsedResume || {},
  });

    // INCREMENT STUDENT COUNT
    if (accountType === "student") {
      const inst = await Institution.findOne({ allowedDomains: getEmailDomain(email), approvalStatus: "ACTIVE" });
      if (inst) {
        await Institution.findByIdAndUpdate(inst._id, { studentsRegistered: (inst.studentsRegistered || 0) + 1 });
      }
    }

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Password login not allowed for this account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // BLOCK STUDENT LOGIN IF INSTITUTION NOT ACTIVE
    if (user.accountType === "student") {
      const domain = user.email.split("@")[1];

      const institution = await Institution.findOne({
        allowedDomains: domain,
        approvalStatus: "ACTIVE",
      });

      if (!institution) {
        return res.status(403).json({
          message:
            "Your institution is not approved yet. Please contact your institution administrator.",
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        accountType: user.accountType,
        role: user.role, // legacy
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      accountType: user.accountType,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const guestLogin = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        accountType: "guest",
        role: "guest",
        interviewCount: 0,
      });
    }

    if (user.accountType !== "guest") {
      return res.status(400).json({
        message: "Email already registered. Please login normally.",
      });
    }

    if (user.interviewCount >= 1) {
      return res.status(403).json({
        message: "Guest interview limit reached",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        accountType: "guest",
        role: "guest",
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

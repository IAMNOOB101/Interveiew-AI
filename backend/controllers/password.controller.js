import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password required" });
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email },
    { password: hash }
  );

  res.json({ message: "Password reset successful" });
};

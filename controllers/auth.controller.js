import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, address });

    const token = createToken(user);
    res
      .cookie("jwt", token, { httpOnly: true, secure: false, sameSite: "Lax" })
      .status(201)
      .json({ message: "Registered successfully", user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res
      .cookie("jwt", token, { httpOnly: true, secure: false, sameSite: "Lax" })
      .status(200)
      .json({ message: "Login successful", user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("jwt").json({ message: "Logged out successfully" });
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = crypto.randomInt(100000, 999999).toString();
  user.resetOtp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();

  //return OTP in response
  res.status(200).json({ message: "OTP sent", otp });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  res.status(200).json({ message: "OTP verified" });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = newPassword;
  user.resetOtp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

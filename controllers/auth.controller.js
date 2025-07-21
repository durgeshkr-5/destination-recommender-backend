const User = require("../model/user.model");
require("dotenv").config();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//NodeMailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

//User Signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "FirstName, lastName, Email, and Password are required." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email is already registered." });
    }
    const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      profile : {firstName, lastName}
    });
    const data = await newUser.save();
    return res.status(201).json({ message: "Signup successful.", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};


//User Login
const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect credentials." });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email,},
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );
    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};


// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:8000/api/v1/auth/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Reset password",
      html: `<p>Reset Link: <a href="${resetLink}">Click here</a></p>`,
    });
    return res.status(200).json({ message: "Reset link sent to email.", resetToken: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};


//Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token." });
    }
    const user = await User.findOne({ email: decoded.email });
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT) || 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const getProfile =async (req,res) => {
  try {
        const userId = req.user.userId;
        const userEmail = req.user.email;
        const profile = await User.findById(userId);

    return res.status(200).json({message:"User profile",data:profile})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}



module.exports = { signup, login, resetPassword, forgotPassword, getProfile };

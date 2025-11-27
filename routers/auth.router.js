const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  sendEmailVerificationCode,
  verifyEmailCode,
  sendForgotPasswordCode,
  updatePassword,
  verifyForgotPasswordCodeAndReset
} = require("../controllers/auth.controller");
const { identifier } = require("../middlewares/identification");

const router = express.Router();

// 🔹 Authentication Routes
router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/signout", identifier, logoutUser);

// 🔹 Email Verification
router.patch("/send-verification-code", identifier, sendEmailVerificationCode);
router.patch("/verify-verification-code", identifier, verifyEmailCode);

// 🔹 Password Management
router.patch("/change-password", identifier, updatePassword);
router.patch("/send-forgot-password-code", sendForgotPasswordCode);
router.patch("/verify-forgot-password-code", verifyForgotPasswordCodeAndReset);

module.exports = router;

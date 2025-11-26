const express = require("express");
const {
  signup,
  signin,
  signout,
  sendVerificationCode,
  verifyVerificationCode,
  changePassword,
  sendForgotPasswordCode,
  verifyForgotPasswordCode
} = require("../controllers/auth.controller");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout",identifier, signout);

router.patch("/send-verification-code",identifier, sendVerificationCode);
router.patch("/verify-verification-code",identifier, verifyVerificationCode);
router.patch("/change-password",identifier,changePassword);
router.patch("/send-forgot-password-code",sendForgotPasswordCode);
router.patch("/verify-forgot-password-code",verifyForgotPasswordCode);


module.exports = router;

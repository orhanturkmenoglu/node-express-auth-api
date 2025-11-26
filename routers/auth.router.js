const express = require("express");
const {
  signup,
  signin,
  signout,
  sendVerificationCode,
  verifyVerificationCode,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

router.post("/send-verification-code", sendVerificationCode);
router.post("/verify-verification-code", verifyVerificationCode);

module.exports = router;

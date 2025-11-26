const User = require("../models/user.model");
const {
  signupSchema,
  signinSchema,
  acceptCodeSchema,
  changePasswordSchema
} = require("../middlewares/validator");
const { doHashing, comparePassword, hmacProcess, doHashValidation } = require("../utils/hashing");
const jwt = require("jsonwebtoken");
const { emailTransporter } = require("../middlewares/mail.config");

// ====================================
// 1️⃣ SIGNUP
// ====================================
const signup = async (req, res) => {
  console.log("🔹 [signup] Request body:", req.body);

  const { email, password } = req.body;

  try {
    // Validate input
    const { error } = signupSchema.validate({ email, password });
    if (error) {
      console.log("❌ Validation failed:", error.details[0].message);
      return res.status(401).json({ message: error.details[0].message });
    }
    console.log("✅ Validation passed");

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠ User already exists:", email);
      return res.status(409).json({ message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await doHashing(password, 12);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();
    savedUser.password = undefined; // Don't return password

    console.log("✅ User created successfully:", savedUser.email);
    return res.status(201).json({
      message: "User created successfully!",
      user: savedUser,
    });
  } catch (err) {
    console.error("🔥 Error during signup:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ====================================
// 2️⃣ SIGNIN
// ====================================
const signin = async (req, res) => {
  console.log("🔹 [signin] Request body:", req.body);

  const { email, password } = req.body;

  try {
    // Validate input
    const { error } = signinSchema.validate({ email, password });
    if (error) {
      console.log("❌ Validation failed:", error.details[0].message);
      return res.status(401).json({ message: error.details[0].message });
    }
    console.log("✅ Validation passed");

    // Find user and include password
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found!" });
    }

    // Check password
    const isPasswordMatch = await comparePassword(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      console.log("❌ Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid password!" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    console.log("✅ User signed in successfully:", email);

    // Send token in cookie
    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Signin successful!",
        token,
      });
  } catch (err) {
    console.error("🔥 Error during signin:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ====================================
// 3️⃣ SIGNOUT
// ====================================
const signout = (req, res) => {
  console.log("🔹 [signout] Request received");
  res.clearCookie("Authorization").json({
    success: true,
    message: "Signout successful!",
  });
};

// ====================================
// 4️⃣ SEND VERIFICATION CODE
// ====================================
const sendVerificationCode = async (req, res) => {
  console.log("🔹 [sendVerificationCode] Request body:", req.body);

  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log("❌ User not found:", email);
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    if (existingUser.verified) {
      console.log("⚠ User already verified:", email);
      return res
        .status(400)
        .json({ success: false, message: "User already verified!" });
    }

    const rawVerificationCode = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    const mailResponse = await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: existingUser.email,
      subject: "Your Verification Code",
      html: `<h1>${rawVerificationCode}</h1>`,
    });

    if (!mailResponse.accepted.includes(existingUser.email)) {
      console.log("❌ Failed to send verification code to:", email);
      return res
        .status(400)
        .json({ success: false, message: "Failed to send verification code!" });
    }

    // Hash and save verification code
    const hashedCode = hmacProcess(
      rawVerificationCode,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    existingUser.verificationCode = hashedCode;
    existingUser.verificationCodeValidation = Date.now();
    await existingUser.save();

    console.log("✅ Verification code sent to:", email);
    return res
      .status(200)
      .json({ success: true, message: "Verification code sent!" });
  } catch (err) {
    console.error("🔥 Error sending verification code:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ====================================
// 5️⃣ VERIFY VERIFICATION CODE
// ====================================
const verifyVerificationCode = async (req, res) => {
  console.log("🔹 [verifyVerificationCode] Request body:", req.body);

  const { email, providedCode } = req.body;

  try {
    // Validate input
    const { error } = acceptCodeSchema.validate({ email, providedCode });
    if (error) {
      console.log("❌ Validation failed:", error.details[0].message);
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    console.log("✅ Validation passed");

    // Find user
    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    if (!existingUser) {
      console.log("❌ User not found:", email);
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    console.log("✅ User found:", existingUser.email);

    // Already verified
    if (existingUser.verified) {
      console.log("⚠ User already verified:", email);
      return res
        .status(400)
        .json({ success: false, message: "You are already verified!" });
    }

    // Check code existence
    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      console.log("❌ Verification code missing or invalid");
      console.log(
        "existingUser.verificationCode:",
        existingUser.verificationCode
      );
      console.log(
        "existingUser.verificationCodeValidation:",
        existingUser.verificationCodeValidation
      );
      return res
        .status(400)
        .json({ success: false, message: "Something is wrong with the code!" });
    }

    // Check expiration (5 minutes)
    const isExpired =
      Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000;
    if (isExpired) {
      console.log("⌛ Verification code expired for:", email);
      return res
        .status(400)
        .json({ success: false, message: "Code has expired!" });
    }

    // Compare hashed codes
    const hashedProvidedCode = hmacProcess(
      providedCode.toString(),
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );
    console.log("🔹 Hashed provided code:", hashedProvidedCode);

    if (hashedProvidedCode === existingUser.verificationCode) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();

      console.log("✅ User verified successfully:", email);
      return res
        .status(200)
        .json({ success: true, message: "Your account has been verified!" });
    }

    console.log("❌ Provided code does not match for user:", email);
    return res
      .status(400)
      .json({ success: false, message: "Verification code is invalid!" });
  } catch (err) {
    console.error("🔥 Error in verifyVerificationCode:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  console.log("🔹 [changePassword] Handler triggered");
  const { userId, verified } = req.user;
  const { oldPassword, newPassword } = req.body;

  console.log("📥 Incoming Request Body:", { oldPassword, newPassword: "***" });
  console.log("👤 Authenticated User:", { userId, verified });

  try {
    // 1️⃣ Validate input
    console.log("🔍 Validating password change schema...");
    const { error } = changePasswordSchema.validate({ oldPassword, newPassword });

    if (error) {
      console.log("❌ Validation Error:", error.details[0].message);
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    console.log("✅ Validation Passed");

    // 2️⃣ Check if user verified
    if (!verified) {
      console.log("⚠ User is not verified!");
      return res
        .status(401)
        .json({ success: false, message: "You are not verified user!" });
    }

    // 3️⃣ Fetch user
    console.log(`🔎 Fetching user from DB: ${userId}`);
    const existingUser = await User.findOne({ _id: userId }).select("+password");

    if (!existingUser) {
      console.log("❌ User not found in DB");
      return res
        .status(401)
        .json({ success: false, message: "User does not exists!" });
    }
    console.log("✅ User found:", existingUser.email);

    // 4️⃣ Validate old password
    console.log("🔐 Validating old password...");
    const result = await doHashValidation(oldPassword, existingUser.password);

    if (!result) {
      console.log("❌ Old password mismatch!");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }
    console.log("✅ Old password validated");

    // 5️⃣ Hash new password
    console.log("🔁 Hashing new password...");
    const hashedPassword = await doHashing(newPassword, 12);
    console.log("🔑 New password hashed successfully");

    // 6️⃣ Save new password
    existingUser.password = hashedPassword;
    await existingUser.save();
    console.log("💾 Password updated in DB successfully");

    return res
      .status(200)
      .json({ success: true, message: "Password updated!" });

  } catch (error) {
    console.log("🔥 Error in changePassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ====================================
// EXPORTS
// ====================================
module.exports = {
  signup,
  signin,
  signout,
  sendVerificationCode,
  verifyVerificationCode,
  changePassword
};

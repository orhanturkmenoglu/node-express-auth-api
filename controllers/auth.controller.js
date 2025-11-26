const User = require("../models/user.model");
const { signupSchema, signinSchema } = require("../middlewares/validator");
const { doHashing, comparePassword, hmacProcess } = require("../utils/hashing");
const jwt = require("jsonwebtoken");
const { emailTransporter } = require("../middlewares/mail.config");

const signup = async (req, res) => {
  // İstekten email ve password bilgilerini alıyoruz
  const { email, password } = req.body;
  console.log(req.body);
  // Validation ve kullanıcı oluşturma işlemleri burada yapılacak ve hashing işlemi gerçekleştirilecek
  try {
    const { error, value } = signupSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }
    // Kullanıcı zaten var mı kontrol et

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashedPassword = await doHashing(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    savedUser.password = undefined; // Şifreyi yanıt olarak göndermiyoruz

    return res.status(201).json({
      message: "User created successfully!",
      user: savedUser,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }

    // .select("+password"); Kullanıcıyı veritabanında bul ve şifre alanını da dahil et
    const existingUser = await User.findOne({ email }).select("+password");
    console.log("existing user :", existingUser);
    if (!existingUser)
      return res.status(404).json({ message: "User not found!" });

    const isPasswordMatch = await comparePassword(
      password,
      existingUser.password
    );
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid password!" });

    // token oluştur

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h", // token 8 saat geçerli olacak
      }
    );

    // cookies olarak token gönder

    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Signin successful!",
        token: token,
      });
  } catch (err) {
    console.error("Error during signin:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signout = (req, res) => {
  console.log("Signout request received");
  // çerezi temizle
  res.clearCookie("Authorization").json({
    success: true,
    message: "Signout successful!",
  });
};

const sendVerificationCode = async (req, res) => {
  // Burada doğrulama kodu oluşturma ve e-posta gönderme işlemleri yapılacak

  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    if (existingUser.verified) {
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
      return res.status(400).json({
        success: false,
        message: "Failed to send verification code!",
      });
    }
    const hashedCode = hmacProcess(
      rawVerificationCode,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    existingUser.verificationCode = hashedCode;
    existingUser.verificationCodeValidation = Date.now();
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Verification code sent!",
    });
  } catch (err) {
    console.error("Error sending verification code:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  sendVerificationCode,
};

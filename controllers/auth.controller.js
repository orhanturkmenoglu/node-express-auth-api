const User = require("../models/user.model");
const { signupSchema, signinSchema } = require("../middlewares/validator");
const { doHashing, verifyPassword } = require("../utils/hashing");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  // İstekten email ve password bilgilerini alıyoruz
  const { email, password } = req.body;

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
    if (!existingUser)
      return res.status(404).json({ message: "User not found!" });

    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password
    );
    if (!isPasswordValid)
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
      .cookie("Authorization", "Bearer", +token, {
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

module.exports = {
  signup,
  signin,
};

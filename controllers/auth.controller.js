const User = require("../models/user.model");
const { signupSchema } = require("../middlewares/validator");
const bcrypt = require("bcryptjs");
const doHashing = require("../utils/hashing");

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

module.exports = {
  signup,
};

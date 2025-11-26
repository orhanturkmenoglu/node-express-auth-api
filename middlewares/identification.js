const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
  console.log("🔍 [identifier] Incoming request for protected route");

  let token;

  // 1️⃣ İstemci türü logu
  console.log("📡 Client Header:", req.headers.client || "undefined");

  // 2️⃣ Tarayıcı / Non-browser ayrımı
  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
    console.log("📨 Token source: Authorization Header");
  } else {
    token = req.cookies["Authorization"];
    console.log("🍪 Token source: Cookie -> Authorization");
  }

  // 3️⃣ Token yoksa
  if (!token) {
    console.log("❌ No token found. Access denied!");
    return res.status(403).json({
      success: false,
      message: "Unauthorized - Token missing!",
    });
  }

  console.log("🔑 Raw token received:", token);

  try {
    // 4️⃣ "Bearer TOKEN" formatıysa ayrıştır
    const userToken = token.includes(" ") ? token.split(" ")[1] : token;

    console.log("🧩 Extracted JWT:", userToken);

    // 5️⃣ JWT verify işlemi
    const jwtVerified = jwt.verify(userToken, process.env.JWT_SECRET);

    console.log("✅ JWT Verified Successfully!");
    console.log("👤 User Payload:", jwtVerified);

    if (jwtVerified) {
      // 6️⃣ Veriyi request içine ekle
      req.user = jwtVerified;
      console.log("📥 req.user content:", req.user); 
      next();
    } else {
      throw new Error("Error in the token");
    }
  } catch (error) {
    console.log("❌ JWT Verification Error:", error.message);

    // JWT spesifik hata türleri
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired!",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token!",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal token verification error!",
    });
  }
};

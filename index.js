const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();

dotenv.config();

// helmet  : kısaca güvenlik için çeşitli HTTP başlıklarını ayarlayan bir Express.js ara yazılımıdır.
// cors   : Cross-Origin Resource Sharing (CORS) politikalarını yönetmek için kullanılır.
// express.json() : Gelen isteklerdeki JSON verilerini ayrıştırmak için kullanılır.
// cookieParser : Gelen isteklerdeki çerezleri ayrıştırmak için kullanılır.
// express.urlencoded() : URL kodlu verileri ayrıştırmak için kullanılır.
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5173, () => {
      console.log(`Server is running on port ${process.env.PORT || 5173}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Auth API" });
});

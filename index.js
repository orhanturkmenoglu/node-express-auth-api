// index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/auth.router");
const postsRouter = require("./routers/post.router");

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Auth API" });
});

module.exports = app;

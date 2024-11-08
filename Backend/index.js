const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

dotenv.config();

const User = require("./models/userModel");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name Is Required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email Is Required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password Is Required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "user already exist",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Rejister Successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  if (userInfo.password !== password) {
    return res.status(400).json({ error: true, message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ userId: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10h",
  });

  return res.json({
    error: false,
    message: "Login successful",
    accessToken,
  });
});



app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;

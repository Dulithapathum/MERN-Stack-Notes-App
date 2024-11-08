const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { authenticateToken } = require("./utilities");

dotenv.config();

const User = require("./models/userModel");
const Note = require("./models/note.model");

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
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  if (userInfo.password !== password) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { userId: userInfo._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10h",
    }
  );

  return res.json({
    error: false,
    message: "Login successful",
    accessToken,
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: req.user.userId,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user.userId;
  if (!title && !content && !tags) {
    return res.status(400).json({
      error: true,
      message: "No Changes Provided",
    });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });
    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note Not Found",
      });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note Update Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const notes = await Note.find({ userId });

    if (notes.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No notes found",
      });
    }

    return res.json({
      error: false,
      notes,
      message: "Notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.userId;

  try {
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({
        error: true,
        message:
          "Note not found or you do not have permission to delete this note",
      });
    }

    await note.deleteOne({ _id: noteId, userId });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;

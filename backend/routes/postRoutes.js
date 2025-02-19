const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/post");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST - Create a new job post
router.post("/", upload.single("image"), async (req, res) => {
  const { description } = req.body;
  if (!description || !req.file) {
    return res.status(400).json({ message: "Description and Image are required" });
  }

  try {
    const imagePath = `http://localhost:8000/uploads/${req.file.filename}`;
    const newPost = new Post({ description, image: imagePath });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// GET - Fetch all job posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

module.exports = router;

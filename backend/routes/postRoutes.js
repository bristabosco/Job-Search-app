const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/post");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,"uploads/")
  },
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

  // Get the full image URL
  const imagePath = `/uploads/${req.file.filename}`;
  const fullImageUrl = `http://${req.hostname}:8000${imagePath}`;

  try {
    const newPost = new Post({ description, image: fullImageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
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

// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const { createPost, getAllPosts } = require("../controller/postController");

// // POST - Create a new post
// router.post("/", upload.single("image"), createPost);

// // GET - Fetch all posts
// router.get("/", getAllPosts);

// module.exports = router;

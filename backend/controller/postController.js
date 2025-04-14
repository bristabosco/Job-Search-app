const Post = require("../models/post");

// Create a new post
const createPost = async (req, res) => {
  const { description,postedBy } = req.body;
  if (!description || !req.file || !postedBy) {
    return res.status(400).json({ message: "Description and Image are required" });
  }

  // Get the full image URL
  const imagePath = `/uploads/${req.file.filename}`;
  const fullImageUrl = `http://${req.hostname}:8000${imagePath}`;

  try {
    const newPost = new Post({ description, image: fullImageUrl ,postedBy});
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

// Fetch all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

module.exports = { createPost, getAllPosts };

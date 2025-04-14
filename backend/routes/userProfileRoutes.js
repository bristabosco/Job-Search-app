const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobSeeker = require("../models/user");

const router = express.Router();

// Ensure 'uploads/' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,"uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File Filter (Only Images & PDFs Allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and PDFs are allowed."), false);
  }
};

// Multer Upload Instance
const upload = multer({
  storage, 
  fileFilter,
});

// 📌 Upload Image & Resume
router.post(
  "/upload",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 }]),
  async (req, res) => {
    try {
      console.log("Received Body:", req.body);
      console.log("Received Files:", req.files);

      if (!req.body.name || !req.body.email || !req.body.phone) {
        return res.status(400).json({ message: "Name, Email, and Phone are required" });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Image and Resume are required" });
      }

      const image = req.files["image"] ? `/uploads/${req.files["image"][0].filename}` : null;
      const resume = req.files["resume"] ? `/uploads/${req.files["resume"][0].filename}` : null;

      if (!image || !resume) {
        return res.status(400).json({ message: "Both Image and Resume are required" });
      }

      const newJobSeeker = new JobSeeker({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image,
        resume,
      });

      await newJobSeeker.save();
      res.status(201).json({ message: "Profile created successfully", jobSeeker: newJobSeeker });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Profile creation failed", error: error.message });
    }
  }
);

// 📌 Get Job Seeker Profile by Email
router.get("/:email", async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findOne({ email: req.params.email });
    if (!jobSeeker) return res.status(404).json({ message: "Profile not found" });

    res.json(jobSeeker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// 📌 Update Job Seeker Profile
router.put(
  "/update/:email",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 }]),
  async (req, res) => {
    try {
      console.log("Received Body:", req.body);
      console.log("Received Files:", req.files);

      const { name, phone } = req.body;
      const jobSeeker = await JobSeeker.findOne({ email: req.params.email });

      if (!jobSeeker) return res.status(404).json({ message: "Profile not found" });

      // Delete old files if new ones are uploaded
      if (req.files["image"]) {
        const oldImagePath = `.${jobSeeker.image}`;
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        jobSeeker.image = `/uploads/${req.files["image"][0].filename}`;
      }

      if (req.files["resume"]) {
        const oldResumePath = `.${jobSeeker.resume}`;
        if (fs.existsSync(oldResumePath)) fs.unlinkSync(oldResumePath);
        jobSeeker.resume = `/uploads/${req.files["resume"][0].filename}`;
      }

      // Update fields
      jobSeeker.name = name || jobSeeker.name;
      jobSeeker.phone = phone || jobSeeker.phone;

      await jobSeeker.save();
      res.json({ message: "Profile updated successfully", jobSeeker });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Profile update failed", error: error.message });
    }
  }
);
// Get Job Seeker Profile by ID
router.get("/id/:id", async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id);
    if (!jobSeeker) return res.status(404).json({ message: "Profile not found" });
    
    res.json(jobSeeker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

module.exports = router;

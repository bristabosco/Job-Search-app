const express = require("express");
const multer = require("multer");
const HRProfile = require("../models/hr");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ POST: Upload HR Profile
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !email || !phone || !company || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newHR = new HRProfile({ name, email, phone, company, image });
    await newHR.save();
    res.status(201).json({ message: "HR profile uploaded successfully", hr: newHR });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ GET: HR Profile (Example - hardcoded email)
router.get("/get", async (req, res) => {
  try {
    const user = await HRProfile.findOne({ email: "hr.johndoe@example.com" });
    if (!user) return res.status(404).json({ message: "HR profile not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ PUT: Update HR Profile
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const hrProfile = await HRProfile.findById(id);
    if (!hrProfile) return res.status(404).json({ message: "HR Profile not found" });

    hrProfile.name = name || hrProfile.name;
    hrProfile.email = email || hrProfile.email;
    hrProfile.phone = phone || hrProfile.phone;
    hrProfile.company = company || hrProfile.company;
    if (image) hrProfile.image = image;

    await hrProfile.save();
    res.status(200).json({ message: "HR profile updated successfully", hr: hrProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ POST: Upload Profile Image only
router.post('/upload-image', upload.single("profileImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;

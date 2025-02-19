const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api/posts", postRoutes);

// Start server
const PORT = 8000;
app.listen(PORT,"0.0.0.0",() => console.log(`Server running on http://localhost:${PORT}`));

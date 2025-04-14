const express = require("express");
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db");

const userProfileRoutes = require('./routes/userProfileRoutes') 
const notificationRoutes = require('./routes/notificationRoutes')
const hrProfileRoutes = require('./routes/hrProfile')
// const jobseekerNotificationRoutes = require('./routes/jobseekerNotification')
const responseRoutes = require('./routes/jobseekerNotification')

//updated
const jobSeekerAuthRoutes = require('./routes/jobSeekerAuth')
const hrAuthRoutes = require('./routes/hrAuth')
const postRoutes = require("./routes/postRoutes");

//env
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:"*"}));

// Serve uploaded images
app.use("/uploads",express.static(path.join(__dirname,'uploads')))

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api/user-profile",userProfileRoutes)
app.use("/api/hr-profile",hrProfileRoutes)
app.use("/api/notification",notificationRoutes)
// app.use("/api/jobseekerNotification",jobseekerNotificationRoutes)



//updated
app.use('/jobSeeker',jobSeekerAuthRoutes)
app.use('/hr',hrAuthRoutes)
app.use("/api/posts", postRoutes);
app.use('/api',responseRoutes)




// Start server
const PORT = process.env.PORT;
app.listen(PORT,"0.0.0.0",() => console.log(`Server running on http://localhost:${PORT}`));

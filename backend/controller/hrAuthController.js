const HR = require('../models/hr')

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Validate role
        if (role !== "HR" && role !== "JobSeeker") {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Choose HR or JobSeeker."
            });
        }
        
        // Check if user already exists
        let user = await HR.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }
        
        // Create new user
        user = new HR({ name, email, password, role });
        await user.save();
        
        res.status(201).json({
            success: true,
            message: "User registered successfully."
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await HR.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }
        
        res.status(200).json({
            success: true,
            message: `Welcome ${user.name}, logged in as ${user.role}.`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
};
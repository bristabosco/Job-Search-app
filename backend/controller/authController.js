const User = require("../models/user");

// Register User
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate role
    if (role !== "HR" && role !== "JobSeeker") {
        return res.status(400).json({
            success:false,
            message:"Invalid role, Choose HR or JobSeeker."
        })
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        return res.status(409).json({
            success:false,
            message:"User already exists."
        })
    }

    // Create new user
    user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
        success: true,
        message:"User registered successfully"
    })
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
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

        // Send proper JSON response
        res.json({
            success: true,
            message: `Welcome ${user.name}, logged in as ${user.role}.`,
            user: {
                name: user.name,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const authenticateToken = require("../middleware/authMiddleware");
const errorHandler = require("../middleware/errorMiddleware");
const router = express.Router();

const { body, validationResult } = require("express-validator");

// Signup Route
router.post("/signup", [
    body("nameSignup").trim().notEmpty().withMessage("Name is required"),
    body("emailSignup").isEmail().withMessage("Invalid email format"),
    body("passwordSignup").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nameSignup, emailSignup, passwordSignup } = req.body;

        console.log("🟢 Received Signup Request:", { nameSignup, emailSignup });

        if (!nameSignup || !emailSignup || !passwordSignup) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: emailSignup });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        if (typeof passwordSignup !== "string" || passwordSignup.trim() === "") {
            return res.status(400).json({ error: "Invalid password format" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordSignup, saltRounds);

        // Create new user
        const newUser = new User({
            name: nameSignup,
            email: emailSignup,
            password: hashedPassword,
            role: "user"
        });

        await newUser.save();
        console.log("✅ New user signed up:", newUser.name);

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, name: newUser.name },
            process.env.JWT_SECRET, 
            { expiresIn: "7d" } // Token valid for 7 days
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(201).json({ message: "Signup successful", user: newUser });

    } catch (error) {
        next(error); // Pass error to middleware
    }
});

// Login Route
router.post("/login", [
    body("emailLogin").isEmail().withMessage("Invalid email format"),
    body("passwordLogin").notEmpty().withMessage("Password is required"),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { emailLogin, passwordLogin } = req.body;
        console.log("🔵 Incoming login request:", req.body);

        const user = await User.findOne({ email: emailLogin });
        if (!user) {
            console.log("❌ No user found with email:", emailLogin);
            return res.status(401).json({ error: "User not found" });
        }

        // Compare hashed password with entered password
        const isMatch = await bcrypt.compare(passwordLogin, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password for:", emailLogin);
            return res.status(401).json({ error: "Incorrect password" });
        }

        console.log("✅ User logged in:", user.name);

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ message: "Login successful", token, user});

    } catch (error) {
        next(error);
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("auth_token");
    res.json({ message: "Logged out successfully" });
});

router.use(errorHandler);

// this goes to dbconnection.js
module.exports = router;

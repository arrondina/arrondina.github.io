const express = require("express");
const User = require("../models/userModel");

const router = express.Router()

// URLs for postman, its like CRUD .get .post .delete .patch
// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { emailSignup, passwordSignup, nameSignup } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email: emailSignup });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        const newUser = new User({
            email: emailSignup,
            password: passwordSignup, // Hash this in production
            name: nameSignup,
        });

        await newUser.save();
        console.log("✅ New user signed up:", newUser.name);
        res.status(201).json({ message: "Signup successful", user: newUser });
    } catch (error) {
        console.error("❌ Signup error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { emailLogin, passwordLogin } = req.body;
        const user = await User.findOne({ email: emailLogin });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        console.log("✅ User found:", user.name);
        res.json({ name: user.name });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// this goes to dbconnection.js
module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { nameSignup, emailSignup, passwordSignup } = req.body;

        console.log("🟢 Received Signup Request:");
        console.log("Name:", nameSignup);
        console.log("Email:", emailSignup);
        console.log("Password:", passwordSignup); 

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

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordSignup, saltRounds);

        // Create new user
        const newUser = new User({
            name: nameSignup,
            email: emailSignup,
            password: hashedPassword,
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
        res.json({ name: user.name, email: user.email });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// this goes to dbconnection.js
module.exports = router;

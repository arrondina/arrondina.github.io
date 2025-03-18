const express = require("express");
const User = require("../models/userModel.js");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin Dashboard Route
router.get("/dashboard", authenticateToken, authorizeAdmin, (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard!", admin: req.user });
});

// Admin-only: Get all users
router.get("/admin/users", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Promote User to Admin
router.put("/admin/make-admin/:userId", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { role: "admin" },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User is now an admin", updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
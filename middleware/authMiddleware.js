const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid or expired token" });
            }

            const user = await User.findById(decoded.id).select("-password");
            
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error("❌ Error fetching user role:", error);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = authenticateToken;
const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require("./routes/adminRoutes.js"); 
const cookieParser = require("cookie-parser");
const authenticateToken = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorMiddleware");
const { passport, sessionMiddleware } = require('./auth');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],

                scriptSrc: [
                    "'self'",
                    "https://cdnjs.cloudflare.com",
                    "https://unpkg.com",                            
                    "'unsafe-inline'",                                    
                ],

                scriptSrcAttr: ["'none'"],                           
                
                imgSrc: [
                    "'self'",
                    "data:",                                             
                    "https://images.unsplash.com",                         
                    "https://developers.google.com",                       
                    "https://mw-cdn.apac.beiniz.biz",
                ],
                
                styleSrc: [
                    "'self'", 
                    "'unsafe-inline'", 
                    "https://cdnjs.cloudflare.com",               
                    "https://unpkg.com",                               
                    "https://fonts.googleapis.com",                        
                ],

                fontSrc: [
                    "'self'", 
                    "https://fonts.gstatic.com",   
                    "https://cdnjs.cloudflare.com",  
                    "https://unpkg.com",    
                    "data:",                   
                ],
                
                frameSrc: ["'self'", "https://accounts.google.com"],      
            },
        },
    })
);

const User = require('./models/userModel.js')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected the MongDB");

        app.use(express.static(path.join(__dirname, 'public')));

        app.use("/", userRoutes);
        app.use("/", adminRoutes); 

        // Google Login Route
        app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        // Google OAuth
        app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/' }),
            (req, res) => {
                try {
                    if (!req.user) {
                        return res.status(401).json({ error: "Authentication failed" });
                    }
                    
                    const user = req.user;  
                    const token = user.token;  
    
                    console.log("🔹 Google OAuth Callback - User:", user);
                    console.log("🔹 Google OAuth Callback - Token:", token);
    
                    // Store JWT in an HTTP-only cookie (More Secure)
                    res.cookie("auth_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production", // Secure in production
                        sameSite: "Strict",
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });
    
                    res.redirect(`/auth/success?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
                } catch (error) {
                    next(error); // Pass error to middleware
                }
            } 
        );

        // Route to handle successful login
        app.get('/auth/success', (req, res) => {
            res.send(`
                <script>
                    const user = {
                        name: "${req.query.name}",
                        email: "${req.query.email}"
                    };
                    localStorage.setItem("user", JSON.stringify(user));
                    window.location.href = "/index.html";
                </script>
            `);
        });

        app.get("/user", authenticateToken, async (req, res) => {
            try {
                const user = await User.findById(req.user.id).select("-password"); 
        
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }
        
                res.json(user);
            } catch (error) {
                console.error("❌ Error fetching user data:", error);
                next(error);
            }
        });

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Book Reviews Page
        app.get('/book-reviews', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'book-reviews.html'));
        });

        // Recommendations Page
        app.get('/recommendations', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'recommendations.html'));
        });

        // About Page
        app.get('/about', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'about.html'));
        });

        // Profile Page
        app.get('/profile', authenticateToken, (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
        });

        // Update Name
        app.put("/update-name", authenticateToken, async (req, res) => {
            try {
                const { newName } = req.body;
                
                const updatedUser = await User.findOneAndUpdate(
                    req.user.id, // Authenticated user ID
                    { $set: { name: newName } }, // Update the name field
                    { new: true } // Return updated document
                );
        
                if (!updatedUser) {
                    return res.status(404).json({ error: "User not found" });
                }
        
                res.json({ success: true, message: "Name updated successfully", updatedUser });
            } catch (error) {
                console.error("Error updating name:", error);
                next(error);
            }
        });

        // Logout Route
        app.get('/logout', (req, res) => {
            res.clearCookie("auth_token");
            req.logout(function (err) {
                if (err) return next(err);
                res.redirect('/');
            });
        });

        app.use(errorHandler);

        app.listen(5000, function() {
            console.log("server is running on 5000")
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Stop the server if DB connection fails
    }
} 

module.exports = { connectDB }
connectDB();
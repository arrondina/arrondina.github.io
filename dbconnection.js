const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

require('dotenv').config();
const session = require('express-session');
const { passport, sessionMiddleware } = require('./auth');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require('./routes/userRoutes.js');
app.use(userRoutes);

const User = require('./models/userModel.js')

const uri = "mongodb+srv://lrjsales:5CC3pLqE80E3JZWq@cluster0.ackb3.mongodb.net/BVDB?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected the DBBBBBBB");

        app.use(express.static(path.join(__dirname, 'public')));

        app.use("/", userRoutes);

        // Google Login Route
        app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        // Google OAuth Callback
        app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/' }),
            (req, res) => {
                console.log("✅ Google Login Successful:", req.user);

                res.redirect(`/auth/success?name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`); // Redirect to homepage after successful login
            }
        );

        // Route to handle successful login
        app.get('/auth/success', (req, res) => {
            res.send(`
                <script>
                    localStorage.setItem("user", JSON.stringify({
                        name: "${req.query.name}",
                        email: "${req.query.email}"
                    }));
                    window.location.href = "/index.html"; // Redirect to homepage
                </script>
            `);
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
        app.get('/profile', isAuthenticated, (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
        });

        // Update Name
        app.put("/update-name", async (req, res) => {
            try {
                const { email, newName } = req.body;
                
                const updatedUser = await User.findOneAndUpdate(
                    { email: email }, // Find user by email
                    { $set: { name: newName } }, // Update the name field
                    { new: true } // Return updated document
                );
        
                if (!updatedUser) {
                    return res.status(404).json({ error: "User not found" });
                }
        
                res.json({ success: true, message: "Name updated successfully", updatedUser });
            } catch (error) {
                console.error("Error updating name:", error);
                res.status(500).json({ error: "Server error" });
            }
        });

        app.listen(5000, function() {
            console.log("server is running on 5000")
        })

        // Logout Route
        app.get('/logout', (req, res) => {
            req.logout(function (err) {
                if (err) return next(err);
                res.redirect('/');
            });
        });

        // Check Authentication Middleware
        function isAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect('/');
        }

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
} 

module.exports = { connectDB }
connectDB();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

const userRoutes = require('./Routes/userRoutes.js');
const User = require('./models/userModel.js')

const uri = "mongodb+srv://lrjsales:5CC3pLqE80E3JZWq@cluster0.ackb3.mongodb.net/BVDB?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected the DBBBBBBB");

        app.use(express.static(path.join(__dirname, 'public')));

        app.post("/signup", async function(req, res) {
            try {
                const { emailSignup, passwordSignup, nameSignup } = req.body;
            
                // Check if user already exists
                const existingUser = await User.findOne({ email: emailSignup });
                if (existingUser) {
                    return res.status(400).json({ error: "User already exists" });
                }
            
                //Create new user
                const newUser = new User({
                    email: emailSignup,
                    password: passwordSignup, // Hash this
                    name: nameSignup,
                });

                await newUser.save();
                console.log("New user signed up:", newUser.name);

                res.redirect("/");
            } catch (error) {
                console.error("Signup error: ", error);
                res.status(500).json({error: "Server error"});
            }
        });

        // Login Route - Validate user credentials
        app.post('/login', async function(req, res) {
            console.log("🔵 Incoming login request:", req.body);
        
            try {
                const user = await User.findOne({ email: req.body.emailLogin });
        
                if (!user) {
                    console.log("❌ No user found with email:", req.body.emailLogin);
                    return res.status(401).json({ error: "User not found" });
                }
        
                console.log("✅ User found:", user.name, user.email);
                res.json({ name: user.name, email: user.email });
                
            } catch (error) {
                console.error("❌ Error finding user:", error);
                res.status(500).json({ error: "Server error" });
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
        app.get('/profile', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
        });

        app.listen(5000, function() {
            console.log("server is running on 5000")
        })

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
} 

module.exports = { connectDB }
connectDB();
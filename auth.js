require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel.js'); 
const expressSession = require('express-session');

const sessionMiddleware = expressSession({
    secret: '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',
    resave: false,
    saveUninitialized: true
  });

passport.use(new GoogleStrategy({
  clientID: '82945037325-6u9vh1j0f0kddvi1of4jfrr59gsh0fmi.apps.googleusercontent.com', 
  clientSecret: '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',
  callbackURL: 'http://localhost:5000/auth/google/callback', // Match the redirect URI
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if(!user) {
        user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "",
            role: "user"
        });

        await user.save();
        console.log("✅ New Google user created:", user.name);
    } else {
        console.log("✅ Existing user logged in:", user.name);
    }

    // Generate a JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token expires in 7 days
    );

    console.log("🔹 Generated JWT:", token);

    user.token = token;
    return done(null, user);
  } catch (error) {
    console.error("❌ Google OAuth error:", error);
    console.log(profile);
    return done(error, null);
  }
}));

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id).select("-password");
      if (!user) return done(null, false);
      done(null, user);
  } catch (error) {
      done(error, null);
  }
});

module.exports = { passport, sessionMiddleware };

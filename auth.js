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
            email: profile.emails[0].value
        });
        await user.save();
        console.log("✅ New Google user created:", user.name);
    } else {
        console.log("✅ Existing user logged in:", user.name);
    }

    return done(null, user);
  } catch (error) {
    console.log(profile);
    return done(error, null);
  }
}));

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });

module.exports = { passport, sessionMiddleware };

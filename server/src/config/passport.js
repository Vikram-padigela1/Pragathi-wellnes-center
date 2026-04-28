const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "production" 
          ? "https://pragathi-wellnes-center.onrender.com/api/auth/google/callback" 
          : "http://localhost:5001/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
          let user = await User.findOne({ 
            $or: [{ googleId: profile.id }, { email: email && email !== "" ? email : "no-match" }] 
          });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName || "User",
              email: email,
              avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
              role: email === process.env.OWNER_EMAIL ? "admin" : "customer",
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (email === process.env.OWNER_EMAIL && user.role !== "admin") {
              user.role = "admin";
            }
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}



module.exports = passport;

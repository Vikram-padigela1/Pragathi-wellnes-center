const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret_pragathi", {
    expiresIn: "30d",
  });
};

const handleOAuthCallback = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=auth_failed`);
  }

  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?token=${token}`);
};

// Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login?error=google_failed" }), handleOAuthCallback);


// Get current user
router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
});

module.exports = router;

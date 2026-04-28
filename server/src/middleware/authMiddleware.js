const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Not authorized to access this route");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_pragathi");
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      const error = new Error("User no longer exists");
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (err) {
    const error = new Error("Not authorized to access this route");
    error.statusCode = 401;
    throw error;
  }
});

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    const error = new Error("Not authorized as an admin");
    error.statusCode = 403;
    throw error;
  }
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_pragathi");
      req.user = await User.findById(decoded.id);
    } catch (err) {
      // ignore token error for optional auth
    }
  }
  next();
});

module.exports = { requireAuth, requireAdmin, optionalAuth };

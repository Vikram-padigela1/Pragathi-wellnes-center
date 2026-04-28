const express = require("express");
const { createEnquiry, getMyEnquiries, getAllEnquiries } = require("../controllers/enquiryController");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireAdmin, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", optionalAuth, asyncHandler(createEnquiry));
router.get("/me", requireAuth, asyncHandler(getMyEnquiries));
router.get("/all", requireAuth, requireAdmin, asyncHandler(getAllEnquiries));

module.exports = router;

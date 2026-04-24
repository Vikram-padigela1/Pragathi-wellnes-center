const express = require("express");
const { createEnquiry } = require("../controllers/enquiryController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(createEnquiry));

module.exports = router;

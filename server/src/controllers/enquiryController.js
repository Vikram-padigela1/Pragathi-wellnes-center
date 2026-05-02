const Enquiry = require("../models/Enquiry");
const { isDatabaseReady } = require("../config/db");
const { sendEnquiryNotification } = require("../services/emailService");

function sanitizeText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function validatePayload(payload) {
  const enquiry = {
    name: sanitizeText(payload.name, 80),
    phone: sanitizeText(payload.phone, 24),
    email: sanitizeText(payload.email, 120),
    service: sanitizeText(payload.service, 120),
    message: sanitizeText(payload.message, 1200),
    source: "website-contact-form",
  };

  if (!enquiry.name) {
    const error = new Error("Please enter your name.");
    error.statusCode = 400;
    throw error;
  }

  if (!enquiry.phone) {
    const error = new Error("Please enter your phone number.");
    error.statusCode = 400;
    throw error;
  }

  if (!/^[+\d()\-\s]{7,20}$/.test(enquiry.phone)) {
    const error = new Error("Please enter a valid phone number.");
    error.statusCode = 400;
    throw error;
  }

  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    const error = new Error("Please enter a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  if (!enquiry.message) {
    const error = new Error("Please enter a short message.");
    error.statusCode = 400;
    throw error;
  }

  return enquiry;
}

async function createEnquiry(request, response) {
  if (!isDatabaseReady()) {
    response.status(503).json({
      ok: false,
      message:
        "Database is not configured yet. Add MONGODB_URI in server/.env so enquiries can be stored and sent to the owner.",
    });
    return;
  }

  const enquiry = validatePayload(request.body || {});
  if (request.user) {
    enquiry.userId = request.user._id;
  }
  const savedEnquiry = await Enquiry.create(enquiry);
  const emailResult = await sendEnquiryNotification(savedEnquiry);

  if (!emailResult.delivered) {
    console.warn("Note: Enquiry saved to DB, but email notification failed or is not configured.");
    response.status(201).json({
      ok: true,
      message: "Thanks for reaching out. Your enquiry has been safely received.",
    });
    return;
  }

  response.status(201).json({
    ok: true,
    message: "Thanks for reaching out. Your enquiry has been received and shared with the business owner.",
  });
}

async function getMyEnquiries(request, response) {
  const enquiries = await Enquiry.find({ userId: request.user._id }).sort({ createdAt: -1 });
  response.status(200).json({ ok: true, enquiries });
}

async function getAllEnquiries(request, response) {
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).populate("userId", "name email");
  response.status(200).json({ ok: true, enquiries });
}

module.exports = {
  createEnquiry,
  getMyEnquiries,
  getAllEnquiries,
};

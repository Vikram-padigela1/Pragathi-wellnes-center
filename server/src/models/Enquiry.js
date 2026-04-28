const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 24,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    service: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    source: {
      type: String,
      default: "website-contact-form",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);

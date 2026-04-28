const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      sparse: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: "string" } } });

module.exports = mongoose.model("User", userSchema);

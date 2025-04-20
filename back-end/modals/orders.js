const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true,
    },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "out for delivery", "delivered"],
    },
    invoiceId: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"], // Add your supported methods
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      unique: true
    },
    address: {
      type: String
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['sent', 'pending', 'failed']
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buyer",
      required: true
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);

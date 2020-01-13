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
        enum: ['sent', 'pending', 'Failed']
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buyer",
      unique: true
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      unique: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);

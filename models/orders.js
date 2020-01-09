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
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);

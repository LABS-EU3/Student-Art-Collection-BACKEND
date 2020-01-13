const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        unique: true
    },
   buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "buyer",
        unique: true
    },
    SchoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        unique: true
    },

    status: {
        type: String,
        required: true,
        enum: ['completed', 'failed', 'pending']
    },
    quantity: {
        type: Number,
        required: [true, 'Transaction must have a quantity']
    },
    totalAmount: {
        type: Number
    }
}, {timestamps: true});

module.exports = mongoose.model('transaction', transactionSchema)
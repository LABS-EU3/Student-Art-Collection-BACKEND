const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Transaction must have a product']
    },
   buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "buyer",
        required: [true, 'Transaction must have a buyer']
    },
    SchoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: [true, 'Transaction must have a school']
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
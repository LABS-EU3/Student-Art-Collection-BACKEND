const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Buyer must have a firstname'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Buyer must have a lastname'],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique: true
    }
}, {timestamps: true})

buyerSchema.add({billingAddress: String, shippingAddress: String})


module.exports = mongoose.model('buyer', buyerSchema)
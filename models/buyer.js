const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Buyer must have a firstname'],
        trim: true
    },
    lasstname: {
        type: String,
        required: [true, 'Buyer must have a lasstname'],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true})

module.exports = mongoose.model('buyer', buyerSchema)
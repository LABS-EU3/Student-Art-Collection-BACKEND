const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      trim: true
    },
    medium: {
      type: String
    },
    subject: {
      type: String
    },
    height: {
      type: Number,
      required: [true, 'Product must have a height']
    },
    width: {
      type: Number,
      required: [true, 'Product must have a width']
    },
    style: {
      type: String
    },
    category: {
      type: String
    },
    materials: {
      type: String
    },
    quantity: {
      type: Number,
      required: [true, 'Product must have a quantity']
    },
    price: {
      type: Number,
      required: [true, 'Product must have a price']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school',
        unique: true
    },
    description: {
      type: String
    },
    picture: {
      type: String,
      required: [true, 'Products must have a picture']
    },
    public_picture_id: {
      type: String,
      required: [true, 'Products must have a picture public id']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('product', productSchema);

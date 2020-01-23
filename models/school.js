const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      unique: true
    },
    description: {
      type: String
    },
    location: {
      type: String
    },
    stripe_user_id: {
      type: String
    }
  },
  { timestamps: true }
);

schoolSchema.indexes({ location: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('school', schoolSchema);

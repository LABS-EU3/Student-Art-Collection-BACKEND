/* eslint-disable func-names */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "User must have a email"],
      unique: true,
      trim: true
    },
    password: {
      type: String
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    profile_picture: {
      type: String,
      trim: true
    },
  
    type: {
      type: String,
      required: true,
      enum: ["school", "buyer"]
    },
    reset_password_token: {
      type: String
    },
    reset_password_expires: {
      type: Number
    },
    auth_id: {
      type: String
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'school'
    }
  },
  { timestamps: true }
);

userSchema.add({
  userLocation: {
    name: String,
    administrative: String,
    country: String,
    latitude: Number,
    longitude: Number,
    postCode: String
  }
});
userSchema.add({
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      index: { type: "2dsphere", sparse: true }
    }
  }
});




userSchema.methods.comparePassword = function(password) {
  const user = bcrypt.compareSync(password, this.password);
  return user ? this : null;
};

userSchema.pre("save", function(next) {
  if (!this.confirmed) {
    const hashPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashPassword;
  }
  next();
});

module.exports = mongoose.model("user", userSchema);

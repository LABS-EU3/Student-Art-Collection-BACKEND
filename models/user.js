const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs')

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
        required: true,
        trim: true
	},
	email: {
		type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean
    },
    profile_picture: {
        type: String,
        trim: true
    },
    location:{
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.comparePassword = function (password) {
    const user = bcrypt.compareSync(password, this.password);
    return user ? this : null;
  };




module.exports = mongoose.model('User', userSchema)

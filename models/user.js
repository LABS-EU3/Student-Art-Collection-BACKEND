const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
        required: [true, 'User must have a name'],
        trim: true
	},
	email: {
		type: String,
        required: [true, 'User must have a email'],
        unique: true,
        trim: true
    },
    username:{
        type: String,
        required: [true, 'User must have a username'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
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
    type: {
        type: String,
        required: true,
        enum: ['school', 'buyer']
    }
}, {timestamps: true});


userSchema.pre('save', function(next) {
    const hashPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashPassword
    next()
})

module.exports = mongoose.model('User', userSchema)

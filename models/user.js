const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
        required: [true, 'User must have a email'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
    },
    confirmed: {
        type: Boolean, 
        default: false
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

userSchema.methods.comparePassword = async function (password) {
    try {
        const user = await bcrypt.compare(password, this.password);
        return user ? this : null;
    } catch (error) {
        return null
    }
  };



userSchema.pre('save', function(next) {
    const hashPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashPassword
    next()
})

module.exports = mongoose.model('User', userSchema)

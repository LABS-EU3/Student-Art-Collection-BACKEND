const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [ true, 'User must have a email' ],
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: [ true, 'User must have a password' ],
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
		profile_picture: {
			type: String,
			trim: true,
		},
		public_id: {
			type: String,
			trim: true,
		},
		location: {
			type: String,
		},
		type: {
			type: String,
			required: true,
			enum: [ 'school', 'buyer' ],
		},
	},
	{ timestamps: true },
);

userSchema.methods.comparePassword = function(password) {
	const user = bcrypt.compareSync(password, this.password);
	return user ? this : null;
};

userSchema.pre('save', function(next){
	if(!this.confirmed) {
		const hashPassword = bcrypt.hashSync(this.password, 10);
		this.password = hashPassword;
	}
	next();
});

module.exports = mongoose.model('user', userSchema);

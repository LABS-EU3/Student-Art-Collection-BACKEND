const mongoose = require('mongoose');
const geocoder = require('../api/helpers/geocoder');

const schoolSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'User must have a name' ],
			trim: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			unique: true,
		},
		description: {
			type: String,
		},
		location: {
			type: {
				type: String,
				enum: [ 'Point' ],
				required: false,
			},
			coordinates: {
				type: [ Number ],
				required: false,
				index: '2dsphere',
			},
			formattedAddress: String,
			street: String,
			streetNumber: String,
			city: String,
			state: String,
			zipcode: String,
			country: String,
			countryCode: String,
		},
		address: {
			type: String,
			required: [ true, 'Please add an address' ],
		},
	},
	{ timestamps: true },
);

schoolSchema.indexes({ location: 1, name: 1 }, { unique: true });

// Geocode & create location field
schoolSchema.pre('save', async function (next){
	const loc = await geocoder.geocode(this.address);
	this.location = {
		type: 'Point',
		coordinates: [ loc[0].longitude, loc[0].latitude ],
		formattedAddress: loc[0].formattedAddress,
		street: loc[0].streetName,
		streetNumber: loc[0].streetNumber,
		city: loc[0].city,
		state: loc[0].stateCode,
		zipcode: loc[0].zipcode,
		country: loc[0].county,
		countryCode: loc[0].countryCode,
	};

	// Do not save address in DB
	this.address = undefined;

	next();
});

module.exports = mongoose.model('school', schoolSchema);

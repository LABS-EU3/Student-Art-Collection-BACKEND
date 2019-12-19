const cloudinary  = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const secret = require('./keys')

cloudinary.config({
	cloud_name: secret.cloud_name,
	api_secret: secret.api_secret,
	api_key: secret.api_key
});


const storage = cloudinaryStorage({
	cloudinary,
	folder: 'art-finder',
	allowedFormats: ['jpg', 'png'],
	transformation: [{ width: 300, height: 300, crop: 'scale' }]
});
	module.exports = storage;
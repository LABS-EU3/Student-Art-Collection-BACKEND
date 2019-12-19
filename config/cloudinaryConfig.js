const cloudinary  = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const secret = require('./keys')

cloudinary.config({
	cloud_name: secret.CLOUD_NAME,
	api_secret: secret.API_SECRET,
	api_key: secret.API_KEY
});


const storage = cloudinaryStorage({
	cloudinary,
	folder: 'art-finder',
	allowedFormats: ['jpg', 'png'],
	transformation: [{ width: 300, height: 300, crop: 'scale' }]
});
	module.exports = storage;
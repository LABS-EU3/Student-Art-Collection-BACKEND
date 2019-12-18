const { config, uploader } = require('cloudinary');
const secret = require('./keys')


const cloudinaryConfig = () =>
	config({
        cloud_name: secret.cloud_name,
        api_secret: secret.api_secret,
		api_key: secret.api_key
	});
module.exports = { cloudinaryConfig, uploader, config};

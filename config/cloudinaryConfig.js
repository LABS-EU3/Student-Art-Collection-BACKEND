const { config, uploader } = require('cloudinary');
const {api_key, api_secret, cloud_name} = require('./keys')


const cloudinaryConfig = () =>
	config({
		cloud_name,
		api_secret,
		api_key
	});
module.exports = { cloudinaryConfig, uploader, config};

const NodeGeocoder = require('node-geocoder');
const { GEO_API_KEY, GEO_PROVIDER } = require('../../config/keys');

const options = {
	provider: GEO_PROVIDER,
	httpAdapter: 'https',
	apiKey: GEO_API_KEY,
	formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

require('dotenv').config();

module.exports = {
	TEST_DB: process.env.TEST_DB,
	DATA_DB: process.env.MONGODB_URI,
	JWTSecret: process.env.JWT_Secret,
	mongoURL:
		'mongodb+srv://petar:admin@artfunder-iayl7.mongodb.net/artfunder?retryWrites=true&w=majority',
	USER_MAIL: process.env.USER_MAIL,
	PASSWORD_MAIL: process.env.PASSWORD_MAIL,
	FRONTEND: process.env.FRONT_END,
	CLOUD_NAME: 'petar',
	API_KEY: '171419394947841',
	API_SECRET: 'oekllQlFBDo17MAA2t54w5r4nBQ',
};

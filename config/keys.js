require('dotenv').config();

module.exports = {
    TEST_DB : process.env.TEST_DB,
    DATA_DB : process.env.MONGODB_URI,
    JWTSecret: process.env.JWT_Secret,
    mongoURL: "mongodb+srv://petar:admin@artfunder-iayl7.mongodb.net/artfunder?retryWrites=true&w=majority",
    USER_MAIL: process.env.USER_MAIL,
    PASSWORD_MAIL: process.env.PASSWORD_MAIL,
    cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
}

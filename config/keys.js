require('dotenv').config();

module.exports = {
    TEST_DB : process.env.TEST_DB,
    DATA_DB : process.env.MONGODB_URI,
    JWTSecret: process.env.JWT_Secret,
    mongoURL: "mongodb+srv://petar:admin@artfunder-iayl7.mongodb.net/artfunder?retryWrites=true&w=majority",
    USER_MAIL: process.env.USER_MAIL,
    PASSWORD_MAIL: process.env.PASSWORD_MAIL,
    FRONTEND: process.env.FRONT_END,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    CLOUD_NAME: process.env.CLOUD_NAME,
	API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
    SENDGRID_USERNAME:process.env.SENDGRID_USERNAME,
    SENDGRID_PASSWORD:process.env.SENDGRID_PASSWORD
}

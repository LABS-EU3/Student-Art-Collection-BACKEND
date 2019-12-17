require('dotenv').config();

module.exports = {
    TEST_DB : process.env.TEST_DB,
    DATA_DB : process.env.DB,
    mongoURL: "mongodb+srv://petar:admin@artfunder-iayl7.mongodb.net/artfunder?retryWrites=true&w=majority"
}

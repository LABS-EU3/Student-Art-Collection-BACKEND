const mongoose = require("mongoose");
const {TEST_DB, DATA_DB} = require('./keys')

let mongoUrl = null

const mongoConnection = () =>{
    if (process.env.NODE_ENV === "test") {
        mongoUrl = TEST_DB || 'mongodb://localhost/test'
    } else {
        mongoUrl = DATA_DB
    }
    return mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
}

module.exports = mongoConnection;

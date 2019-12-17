const mongoose = require('mongoose');
const db = require('../config/db');
const User = require('../models/user');


mongoose.Promise = global.Promise;

const model = {
    user : User
};

const cleanDB = async () => {
    // drop all database here
    await model.user.remove({})
}

const connectDB =  async () => {
    try {
        const connect = await db()
        return connect
    } catch (error) {
        return console.error(error)
    }
}

const disconnectDB = async () => {
    await mongoose.disconnect()
}

module.exports = {
    cleanDB,
    connectDB,
    disconnectDB
}

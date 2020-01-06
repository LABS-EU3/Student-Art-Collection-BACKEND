const mongoose = require('mongoose');
const db = require('../config/db');
const User = require('../models/user');


mongoose.Promise = global.Promise;

const model = {
    user : User
};

const cleanDB =  () => {
    // drop all database here
    return model.user.deleteMany({})
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
    try {
        const disconnect = await mongoose.disconnect()
        return disconnect
    } catch (error) {
        return console.error(error)
    }
}

const userData = {
    name: "user1",
    email: `user1@gmail.com`,
    password: "123456789",
    type: "school"
  };

const createUser = ()=> {
      return model.user.create(userData)
};

const getUser = async ()=>{
    const user = await model.user.findOne({email: "user1@gmail.com"}).exec();
    return user
}

module.exports = {
    cleanDB,
    connectDB,
    disconnectDB,
    createUser,
    userData,
    getUser
}

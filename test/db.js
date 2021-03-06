/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const db = require('../config/db');
// const User = require('../models/user');
const {
  Products,
  Transaction,
  order,
  Buyer,
  User,
  School
} = require('../models/index');

mongoose.Promise = global.Promise;

// const model = {
//   user: User
// };

const cleanDB = async () => {
  // drop all database here
  const deleteUser = await User.deleteMany({});
  const deleteBuyer = await Buyer.deleteMany({});
  const deleteSchool = await School.deleteMany({});
  const deleteProducts = await Products.deleteMany({});
  const deleteTransactions = await Transaction.deleteMany({});
  const deleteOrders = await order.deleteMany({});
  return (
    deleteUser &&
    deleteProducts &&
    deleteTransactions &&
    deleteOrders &&
    deleteBuyer && deleteSchool
  );
};

const connectDB = async () => {
  try {
    const connect = await db();
    return connect;
  } catch (error) {
    return console.error(error);
  }
};

const disconnectDB = async () => {
  try {
    const disconnect = await mongoose.disconnect();
    return disconnect;
  } catch (error) {
    return console.error(error);
  }
};

const userData = {
  name: 'user1',
  email: `user1@gmail.com`,
  password: '123456789',
  type: 'school',
  userLocation: {
    name: '12th',
    administrative: "Lagos",
    country: "Nigeria",
    latitude: 3.678,
    longitude: 7.689,
    postCode: "23456"
    
  },
  location: {
    type: "Point",
    coordinates: [3.678, 7.689]
  }
};

const user2Data = {
  name: 'user2',
  email: `user1000@gmail.com`,
  password: '123456789',
  type: 'buyer',
  userLocation: {
    name: '12th',
    administrative: "Lagos",
    country: "Nigeria",
    latitude: 3.678,
    longitude: 7.689,
    postCode: "23456"
    
  },
  location: {
    type: "Point",
    coordinates: [3.678, 7.689]
  }
};

const buyerData = {
  email: 'user2@gmail.com',
  password: '123456789',
  type: 'buyer'
};

const schoolData = {
  email: 'user3@gmail.com',
  password: '123456789',
  type: 'school'
};

const createUser = () => {
  return User.create(userData);
};


const createUser2 = () => {
  return User.create(user2Data);
};


const createBuyer = () => {
  return User.create(buyerData).then(response => {
    return Buyer.create({
      firstname: 'Test',
      lastname: 'scenerio',
      userId: response._id
    });
  });
};

const createSchool = () => {
  return User.create(schoolData).then(res => {
    return School.create({
      name: 'mySchool',
      userId: res._id
    });
  });
}

const getBuyer = async () => {
  const buyer = await User.findOne({ email: 'user2@gmail.com' });
  return buyer;
};
const getUser = async () => {
  const user = await User.findOne({ email: 'user1@gmail.com' }).exec();
  return user;
};
const getUser2 = async () => {
  const user = await User.findOne({ email: 'user1000@gmail.com' }).exec();
  return user;
};

const createProduct = async () => {
  const artData = {
    name: 'art',
    height: 30,
    width: 30,
    quantity: 3,
    artistName: 'John bellion',
    description: 'A very beautiful art',
    price: 299,
    userId: await (await getUser()).id,
    public_picture_id: '12345',
    picture: '123456'
  };
  const product = await Products.create(artData);
  return product;
};
const getProduct = async () => {
  const product = await Products.findOne({ name: 'art' }).exec();
  return product;
};

const createTransaction = async () => {
  const buyer = await createBuyer();
  const transactionData = {
    productId: await (await getProduct()).id,
    buyerId: buyer._id,
    schoolId: '5e24d82e4976111d3c9835z2',
    status: 'completed',
    quantity: 1,
    totalAmount: 100
  };
  const transaction = await Transaction.create(transactionData);
  return transaction;
};

const getTransaction = async () => {
  const transaction = await Transaction.findOne({ status: 'completed' }).exec();
  return transaction;
};
const createOrders = async () => {
  const orderData = {
    transactionId: await (await getTransaction()).id,
    status: 'pending',
    address: '112, ahmadu bello way victoria island, lagos'
  };
  const orders = await order.create(orderData);
  return orders;
};

const getOrders = async () => {
  const Order = await order
    .findOne({ address: '112, ahmadu bello way victoria island, lagos' })
    .exec();
  return getOrders;
};
module.exports = {
  cleanDB,
  connectDB,
  disconnectDB,
  createUser,
  userData,
  getUser,
  createBuyer,
  getBuyer,
  createProduct,
  getProduct,
  createTransaction,
  getTransaction,
  createOrders,
  getOrders,
  createSchool,
  createUser2,
  getUser2
};

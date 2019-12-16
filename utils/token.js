const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (payload) => {
  const user = {
    userId: payload.id,
    userName: payload.username,
    email: payload.email,
  };
  const token = jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: '60d',
  });
  return token;
};

module.exports = createToken;
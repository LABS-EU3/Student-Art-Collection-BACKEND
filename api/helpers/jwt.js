const jwt = require("jsonwebtoken");
const { JWTSecret } = require('../../config/keys');
const User = require('../../models/user');

async function generateToken(user) {
  const payload = {
    subject: user.id,
    // email: user.email
  };

  const options = {
    expiresIn: "5d"
  };
  try {
    const token = await jwt.sign(payload,JWTSecret, options);
    return token;
  } catch (error) {
     return error.message;
  }
}

async function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, JWTSecret)
    const user = await User.findById(decoded.subject).exec();
    if(!user) throw Error('no such user');
    return user;
  } catch (error) {
    return error
  }
}
module.exports = {
  generateToken,
  decodeToken
};

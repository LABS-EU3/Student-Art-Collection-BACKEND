const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
  generateToken(user) {
    return jwt.sign({
      subject: user.id,
    }, 'secret', { expiresIn: '60d' });
  },

  async authenticate(token) {
    try {
      const decode = await jwt.verify(token, 'secret');
      const user = await User.findById(decode.subject).exec();
      if (!user) throw new Error();
      return user;
    } catch (error) {
      return null;
    }
  },
};
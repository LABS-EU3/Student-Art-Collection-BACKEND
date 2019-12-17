const bcrypt = require('bcrypt');
const createToken = require('../models/user');
const User = require('../models/user')

async function login(credentials) {
    const errors = { error: 'Invalid username or password' };
    const user = await User.findOne({
      where: { email: credentials.email },
    });
    if (user) {
      const checkPassword = bcrypt.compareSync(credentials.password, user.dataValues.password);
      if (checkPassword) {
        const token = createToken(user);
        return {
          id: user.id, email: user.email, usernname: user.username, token,
        };
      }
      return errors;
    }
    return user;
  }


module.exports = login;
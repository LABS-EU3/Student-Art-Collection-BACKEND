const bcrypt = require('bcryptjs');
const models = require("../../models/user");
const { generateToken } = require("../helpers/jwt");
const User = require('../../models/user');

module.exports = {
  async createUser(req, res) {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const createUser = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        password: hash
      };
      const user = await models.create(createUser);
      if (user) {
        const newUser = {
          username: user.name,
          email: user.email,
          id: user.id
        };

        const token = await generateToken(newUser);
        res.status(201).json({
          user: newUser,
          token
        });
      }
      res.status(400).json({
        error: "Could not create Profile"
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  },
  async loginUser (req, res) {
    const user = await User.findOne({ email: req.body.email }).exec();
    const login = user.comparePassword(req.body.password);
    if(!login) {
      res.status(404).json({
        error: 'invalid credentials'
      });
    }
    return res.status(200).json({user:login, token: generateToken(login)})
  }
};

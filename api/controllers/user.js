const bcrypt = require('bcryptjs');
const models = require("../../models/user");

const { generateToken } = require("../helpers/jwt");

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
  }
};

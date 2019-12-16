// const bcrypt = require("bcryptjs");

// const jwt = require("../helpers/jwt");

module.exports = {
  async createUser(req, res) {
    try {
      //  const hash = bcrypt.hashSync(user.password, 10);
      //   const createUser = {
      //     ...req.body,
      //     email: req.body.email.toLowerCase(),
      //     password: hash
      //   };
      //   const user = await models.Users.create(createUser);
      //   if (user) {
      //     const newUser = {
      //       password: user.password,
      //       username: user.username,
      //       email: user.email,
      //       id: user.id
      //     };

      //     const token = await jwt.generateToken(newUser);
      //     res.status(201).json({
      //       user: newUser,
      //       token
      //     });
      //   }
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

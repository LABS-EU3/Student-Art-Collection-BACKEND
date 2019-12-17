/* eslint-disable object-shorthand */
const Validator = require("validatorjs");
const models = require("../../models/user");

module.exports = {
  async validateUserEmail(req, res, next) {
    const { email } = req.body;
    const validator = new Validator(req.body, {
      email: "required|email"
    });
    if (validator.fails()) {
     return res.status(400).json({
        error: "Input a valid email"
      });
    }
    try {
      const user = await models.findOne({ email: email });
      if (!user) {
       return res.status(404).json({
          error: "User not found"
        });
      }
      req.userEmail = user;
      return next();
    } catch (error) {
      return next({ message: "Server error try again" });
    }
  },


  async validateUserOnSignup(req, res, next) {
    const validator = new Validator(req.body, {
      password: "required|min:8",
      email: "required|email"
    });

    if (validator.fails()) {
    return  res.status(400).json({
        errors: validator.errors.all()
      });
    }
    try {
      const user = await models.findOne({ email: req.body.email });
      if (!user) {
        return next();
      }
      return res.status(400).json({
        error: "User already registered with username or email provided"
      });
    } catch (error) {
      return next({ message: "Error validating user signup" });
    }
  }
};
// eslint-disable-next-line func-names
process.on('unhandledRejection', function(err) {
  console.log(err);
});
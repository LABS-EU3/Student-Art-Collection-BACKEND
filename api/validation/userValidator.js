/* eslint-disable object-shorthand */
const Validator = require("validatorjs");
const models = require("../../models/user");
const {errorHelper} = require('../helpers/response');

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
      email: "required|email",
      type: "required"
    });

    if (validator.fails()) {
    return  res.status(400).json({
        errors: validator.errors.all()
      });
    }
    try {
      const user = await models.findOne({ email: req.body.email }).exec();
      if (!user) {
        return next();
      }
      return res.status(400).json({
        error: "User already registered with email provided"
      });
    } catch (error) {
      return next({ message: "Error validating user signup" });
    }
  },

  async validateUserBuyerSchool(req, res, next) {
    switch (req.body.type) {
      case('school'): {
        const validator = new Validator(req.body, {
          name: "required|min:2"
        });
        if(validator.fails()) {
          return errorHelper(res, 400, validator.errors.all())
        }
        return next();
      }
      case('buyer'): {
         const validator = new Validator(req.body, {
          firstname:"required|min:2",
          lastname:"required|min:2"
        });
        if(validator.fails()) {
          return errorHelper(res, 400, validator.errors.all())
        }
        return next();
      }
      default:
        return next('error')
    }
  }
};

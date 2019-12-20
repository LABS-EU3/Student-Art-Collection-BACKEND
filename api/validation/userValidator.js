/* eslint-disable object-shorthand */
const Validator = require("validatorjs");
const models = require("../../models/user");

const {errorHelper} = require('../helpers/response');
const { decodeToken } = require('../helpers/jwt');


module.exports = {
  async validateUserEmail(req, res, next) {
    const { email } = req.body;
    const validator = new Validator(req.body, {
      email: "required|email"
    });
    if (validator.fails()) {
      return errorHelper(res, 400, "Input a valid email");
    }
    try {
      const user = await models.findOne({ email: email });
      if (!user) {
        return errorHelper(res, 404, "User not found");
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
      return res.status(400).json({
        errors: validator.errors.all()
      });
    }
    try {
      const user = await models.findOne({ email: req.body.email }).exec();
      if (!user) {
        return next();
      }
      return errorHelper(
        res,
        400,
        "User already registered with email provided"
      );
    } catch (error) {
      return next({ message: "Error validating user signup" });
    }
  },

  async validateUserBuyerSchool(req, res, next) {
    switch (req.body.type) {
      case "school": {
        const validator = new Validator(req.body, {
          name: "required|min:2"
        });
        if (validator.fails()) {
          return errorHelper(res, 400, validator.errors.all());
        }
        return next();
      }
      case "buyer": {
        const validator = new Validator(req.body, {
          firstname: "required|min:2",
          lastname: "required|min:2"
        });
        if (validator.fails()) {
          return errorHelper(res, 400, validator.errors.all());
        }
        return next();
      }
      default:
        return next("error");
    }
  },
  validatePassword(req, res, next) {
    const { body } = req;
    const validator = new Validator(body, {
      password: "required|min:8"
    });
    if (validator.fails()) {
      return errorHelper(res, 400, "Password must be at least 5 characters");
    }

    return next();

  },

  loginCredentials(req,res,next) {
    const validator = new Validator(req.body, {
      password: "required|min:8",
      email: "required|email"
    });

    if (validator.fails()) {
    return  errorHelper(res, 400, validator.errors.all())
    }
    return next()
  },

  async validateUser(req, res, next) {
    const {authorization} = req.headers;
    if(!authorization) {
      return errorHelper(res, 401, 'token required')
    }
    const user = await decodeToken(authorization)
    if(!user) {
      return errorHelper(res, 401, 'invalid user token')
    }
    req.user = user;
    return next()
  },

  validateUserTokenRequest(req, res, next) {
    const { id } = req.params;
    // eslint-disable-next-line eqeqeq
    if(req.user.id  !=  id ) {
      return errorHelper(res, 401, 'you cannot continue with this operation')
    }
    return next()

  }
};

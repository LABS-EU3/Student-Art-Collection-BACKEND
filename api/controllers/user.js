const bcrypt = require('bcryptjs');
const { merge } = require('lodash');
const models = require("../../models/user");
const User = require('../../models/user');



const { generateToken, decodeToken } = require("../helpers/jwt");
const { successResponse, errorHelper } = require("../helpers/response");
const { sendEmailConfirmAccount } = require('../helpers/mail');

module.exports = {
  async createUser(req, res, next) {
    try {
      const user = await models.User.create(req.body);
      if (user) {
        const newUserType = {...req.body, userId: user.id}
        // this checks the user type and create that user type
        if (user.type === 'school')  {
          await models.School.create(newUserType)
        }else {
          await models.Buyer.create(newUserType)
        }
        const token = await generateToken(user);
        await sendEmailConfirmAccount(user, token,'frontend url')
        return successResponse(res, 201, {msg: 'Usercreated', token})
      }
      return errorHelper(res,400, {
        error: "Could not create Profile"
      });
    } catch (error) {
      return next(error.message)
    }
  },

  async activateUser(req, res, next) {
    try {
      const user = await decodeToken(req.body.token);
      if(!user) {
        return errorHelper(res, 400, 'invalid token for user')
      }
      merge(user, {confirmed:true})
      user.save()
      return successResponse(res, 200, `${user.email} successfully confirmed`)
    } catch (error) {
      return next(error);
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

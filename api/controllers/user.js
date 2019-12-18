const { merge } = require('lodash');
const models = require("../../models");
const secret = require('../../config/keys')



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
        await sendEmailConfirmAccount(user, token,`${secret.FRONTEND}/success`)
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
  async loginUser (req, res, next) {
    try{
    const user = await models.User.findOne({ email: req.body.email }).exec();
    const login = user.comparePassword(req.body.password);
    if(!login) {
      return errorHelper(res, 404, 'Invalid credentials');
    }
    const token = await generateToken(login);
    if(!login.confirmed) {
      await sendEmailConfirmAccount (user, token,`${secret.FRONTEND}/success`)
      return successResponse(res, 200, {message: 'please check your email address to confirm account'})
    }
    return successResponse(res, 200, {message: 'successfully logged in', token })
  } catch(error) {
    return next({ message: 'Error logging in user' });
  }
  }
};

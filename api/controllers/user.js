const models = require("../../models/user");

const { generateToken } = require("../helpers/jwt");
const { successResponse, errorHelper } = require("../helpers/response");
const { sendEmailConfirmAccount } = require('../helpers/mail');

module.exports = {
  async createUser(req, res, next) {
    try {
      const user = await models.create(req.body);
      if (user) {
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
  }
};

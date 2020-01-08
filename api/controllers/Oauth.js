const response = require("../helpers/response");
const { generateToken } = require("../helpers/jwt");
const keys = require("../../config/keys");

module.exports = {
  async socialAuthlogin(req, res, next) {
    const { user } = req;
    console.log('hiiiii')
    try {
      const token = await generateToken(user);
      return res.redirect(`${keys.FRONTEND}/myaccount?token=${token}`);
    } catch (error) {
      return next({ message: `${error.message}` });
    }
  }
};

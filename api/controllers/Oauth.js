const response = require("../helpers/response");
const { generateToken } = require("../helpers/jwt");
const keys = require("../../config/keys");

module.exports = {
  async socialAuthlogin(req, res, next) {
    const { user } = req;

    try {
      const token = await generateToken(user);
      res.redirect(`${keys.FRONTEND_BASE_URL}/auth/social?token=${token}`);
    } catch (error) {
      return next({ message: `${error.message}` });
    }
  }
};

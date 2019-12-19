const response = require('../helpers/response');
const { generateToken } = require('../helpers/jwt');

module.exports = {
  async socialAuthlogin(req, res, next) {
    const { user } = req;

    try {
      const token = await generateToken(user.dataValues);

      return response.success(res, 200, {
        message: `${user.dataValues.email} successfully logged in.`,
        token
      });
    } catch (error) {
      return next({ message: `${error.message}` });
    }
  }
};
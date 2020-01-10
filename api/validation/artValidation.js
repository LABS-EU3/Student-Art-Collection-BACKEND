// MODELS
const models = require('../../models/index');

// HELPERS
const { errorHelper } = require('../helpers/response');

module.exports = {
  validateArtBody(req, res, next) {
    const { name, height, width, quantity, price, picture } = req.body;
    if (!name || !height || !width || !quantity || !price || !picture) {
      errorHelper(res, 401, { message: 'Please provide all required fields' });
    } else {
      next();
    }
  }
};

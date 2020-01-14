// DEPENDENCIES
const Validator = require('validatorjs');

// MODELS
const models = require('../../models/index');

// HELPERS
const { errorHelper } = require('../helpers/response');

module.exports = {
  validateArtBody(req, res, next) {
    const validator = new Validator(req.body, {
      name: 'required',
      height: 'required',
      width: 'required',
      quantity: 'required',
      price: 'required'
    });
    if (validator.fails()) {
      errorHelper(res, 401, { message: validator.errors.all() });
    } else next();
  },
  validateArtFilter(req, res, next) {
    const fields = models.Products.schema.paths;
    const { filter } = req.query;
    if (!fields[filter]) {
      return errorHelper(res, 500, { message: 'This filter does not exist' });
    }
    return next();
  }
};

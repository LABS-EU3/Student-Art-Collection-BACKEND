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
      errorHelper(res, 400, { message: validator.errors.all() });
    }
    return next();
  },
  addPagination(req, res, next) {
    const { page, pagination } = req.query;
    if (!page) {
      req.query.page = 1;
    }
    if (!pagination) {
      req.query.pagination = 10;
    }
    return next();
  }
};

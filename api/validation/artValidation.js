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
    // if no filter is passed in the query string, we assign it to filter field name by default and we move on to the next.
    if (!filter) {
      req.query.filter = !filter ? 'name' : filter;
      return next();
    }
    // if this piece of code executes, it means that filter had a value in the query string. Next we check if there is a column called like that in the schema model that we can filter on.
    if (!fields[filter]) {
      return errorHelper(res, 404, { message: 'This filter does not exist' });
    }
    return next();
  },
  validateArtSortType(req, res, next) {
    const { sortType } = req.query;
    if (sortType !== 'asc' && sortType !== 'desc') {
      req.query.sortType = 'asc';
      return next();
    }
    return next();
  },
  validatePagination(req, res, next) {
    req.query.page = !req.query.page ? 1 : parseInt(req.query.page, 10);
    req.query.pagination = !req.query.pagination ? 12 : parseInt(req.query.pagination, 10);
    return next();
  },
  validateSort(req, res, next) {
    const fields = models.Products.schema.paths;
    req.query.sortBy = !req.query.sortBy ? '_id' : req.query.sortBy;
    req.query.sortType = req.query.sortType === 'asc' ? 1 : -1;
    if (!fields[req.query.sortBy]) {
      return errorHelper(res, 404, {
        message: 'This sorting field does not exist'
      });
    }
    return next();
  },
  validateFilter(req, res, next) {
    const fields = models.Products.schema.paths;
    const { filter } = req.query;
    // if no filter is passed in the query string, we assign it to filter field name by default and we move on to the next.
    req.query.filter = !filter ? 'name' : filter;

    // if this piece of code executes, it means that filter had a value in the query string. Next we check if there is a column called like that in the schema model that we can filter on.
    if (!fields[req.query.filter]) {
      return errorHelper(res, 404, {
        message: 'This filter option does not exist'
      });
    }
    return next();
  },
  validateSearchQuery(req, res, next) {
    req.query.searchQuery = !req.query.searchQuery ? '' : req.query.searchQuery;
    return next();
  }
};

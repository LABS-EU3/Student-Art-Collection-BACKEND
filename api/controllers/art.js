// MODELS
const models = require('../../models/index');

// HELPERS
const { successResponse, errorHelper } = require('../helpers/response');

module.exports = {
  testArt(req, res) {
    return successResponse(res, 200, { message: 'hello from endpoint' });
  }
};

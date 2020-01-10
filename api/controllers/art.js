// MODELS
const models = require('../../models/index');

// HELPERS
const { successResponse, errorHelper } = require('../helpers/response');

module.exports = {
  testArt(req, res) {
    return successResponse(res, 200, { message: 'hello from endpoint' });
  },

  uploadArt(req, res) {
    const { id } = req.params;
    return models.Products.create({ ...req.body, userId: id })
      .then(response => {
        return successResponse(res, 200, response);
      })
      .catch(error => {
        return errorHelper(res, 401, {
          message: `There was an error uploading your piece of art: ${error.message}`
        });
      });
  }
};

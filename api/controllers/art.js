// MODELS
const models = require('../../models/index');

// HELPERS
const { successResponse, errorHelper } = require('../helpers/response');

module.exports = {
  uploadArt(req, res) {
    const { id } = req.user;
    const { file } = req;
    return models.Products.create({
      ...req.body,
      userId: id,
      picture: file.secure_url,
      public_picture_id: file.public_id
    })
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

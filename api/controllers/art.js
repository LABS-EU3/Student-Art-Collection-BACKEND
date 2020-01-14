// MODELS
const models = require('../../models/index');

// HELPERS
const { successResponse, errorHelper } = require('../helpers/response');

module.exports = {
  async uploadArt(req, res, next) {
    const { id } = req.params;
    const { file } = req;
    try {
      const newArt = await models.Products.create({
        ...req.body,
        userId: id,
        picture: file.secure_url,
        public_picture_id: file.public_id
      });
      return successResponse(res, 200, newArt);
    } catch (error) {
      return next(error.message);
    }
  },

  // FETCH ALL ART
  async fetchArt(req, res) {
    try {
      const pagination = req.query.pagination
        ? parseInt(req.query.pagination, 10)
        : 10;
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const art = await models.Products.find()
        .skip((page - 1) * pagination)
        .limit(pagination);
      return successResponse(res, 200, art);
    } catch (error) {
      return errorHelper(res, 401, error.message);
    }
  }
};

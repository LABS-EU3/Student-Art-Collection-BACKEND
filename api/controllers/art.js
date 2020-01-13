// MODELS
const models = require('../../models/index');

// HELPERS
const { successResponse, errorHelper } = require('../helpers/response');

module.exports = {
  async uploadArt(req, res) {
    const { id } = req.user;
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
      return errorHelper(res, 401, {
        message: `There was an error uploading your piece of art: ${error.message}`
      });
    }
  },
  async fetchArt(req, res) {
    try {
      const pagination = req.query.pagination
        ? parseInt(req.query.pagination, 10)
        : 10;
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const art = await models.Products.find()
        .skip((page - 1) * pagination)
        .limit(pagination);
      res.status(200).json(art);
    } catch (error) {
      res.status(401).json(error.message);
    }
  }
};

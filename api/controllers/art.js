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

  async artPendingCollection(req, res, next) {
    const { id } = req.params;
    try {
      const schoolOrders = await models.order.find({schoolId: id, status: 'pending'})
        .populate('transactionId').populate('buyerId').exec();
      return successResponse(res, 200, schoolOrders);
    } catch (error) {
      return next(error)
    }
  }
};

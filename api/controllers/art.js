const mongoose = require('mongoose');
const { successResponse, errorHelper } = require('../helpers/response');
const models = require('../../models');
const artMail = require('../helpers/artmail');
const secret = require('../../config/keys');

module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;

    const { id } = req.params;

    try {
      const objectId = mongoose.Types.ObjectId(id.toString());

      const transaction = await models.Transaction.findById(objectId)
        .populate('buyerId')
        .populate('productId');

      const order = await models.order.findOneAndUpdate(
        { transactionId: objectId },
        { status: 'completed' },
        { new: true }
      );

      artMail(
        secret.FRONTEND_BASE_URL,
        user.email,
        transaction.buyerId.firstname,
        transaction.productId
      );

      return successResponse(res, 200, order);
    } catch (error) {
      return next(error.message);
    }
  },

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

  async artSoldCollection(req, res, next) {
    const { id } = req.params;
    const { status } = req.query;
    try {
      let schoolOrders = null;
      if (status === 'all') {
        schoolOrders = await models.order
          .find({ schoolId: id })
          .populate('transactionId')
          .populate('buyerId')
          .exec();
      } else {
        schoolOrders = await models.order
          .find({ schoolId: id, status })
          .populate('transactionId')
          .populate('buyerId')
          .exec();
      }
      return successResponse(res, 200, schoolOrders);
    } catch (error) {
      return next(error);
    }
  },

  async searchArt(req, res, next) {
    try {
      const { searchQuery } = req.query;
      const { filter, sortBy, page, pagination } = req.query;
      let { sortType } = req.query;
      sortType = sortType === 'asc' ? 1 : -1;
      const art = await models.Products.find({
        [filter]: { $regex: searchQuery, $options: 'i' }
      })
        .sort({ [sortBy]: sortType })
        .skip((page - 1) * pagination)
        .limit(pagination);
      const totalCount = await models.Products.countDocuments({});
      return successResponse(res, 200, {
        totalCount,
        page,
        itemsInPage: pagination,
        art
      });
    } catch (error) {
      return next(error.message);
    }
  }
};

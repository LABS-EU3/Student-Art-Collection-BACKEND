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

  async uploadArt(req, res, next) {
    const { id } = req.param;
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
      const art = await models.Products.find({})
        .sort({ _id: -1 })
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
      return errorHelper(res, 401, error.message);
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
  async editArt(req, res, next) {
       const { id } = req.params
       
       try {
         const art = await models.Products.findOneAndUpdate({_id: id}, req.body, {new: true})
        
         return id
       } catch(error) {
         return next(error)
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

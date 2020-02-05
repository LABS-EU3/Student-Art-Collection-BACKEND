/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { merge } = require('lodash');
const { successResponse, errorHelper } = require('../helpers/response');
const models = require('../../models');
const orders = require('../../models/orders');
const artMail = require('../helpers/artmail');
const secret = require('../../config/keys');
const { getArtSold } = require('../helpers/artOrders');

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
      const {
        page,
        pagination,
        sortBy,
        sortType,
        searchQuery,
        filter
      } = req.query;
      const art = await models.Products.find({
        [filter]: { $regex: searchQuery, $options: 'i' }
      })
        .sort({ [sortBy]: sortType })
        .skip((page - 1) * pagination)
        .limit(pagination)
        .populate({
          path: 'userId',
          populate: {
            path: 'userId'
          }
        });
      const totalCount = await models.Products.find({
        [filter]: { $regex: searchQuery, $options: 'i' }
      }).countDocuments();
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
    const schoolId = req.params.id;
    try {
      const schoolOrders = await getArtSold(
        models.order,
        req,
        { schoolId },
        'buyerId'
      );
      return successResponse(res, 200, schoolOrders);
    } catch (error) {
      return next(error);
    }
  },
  async artBoughtCollection(req, res, next) {
    const buyerId = req.params.id;
    try {
      const buyerOrders = await getArtSold(
        models.order,
        req,
        { buyerId },
        'schoolId'
      );
      return successResponse(res, 200, buyerOrders);
    } catch (error) {
      return next(error);
    }
  },
  async editArt(req, res, next) {
    const { id } = req.params;
    const { product } = req;
    try {
      const art = await merge(product, req.body).save();
      return successResponse(res, 200, art);
    } catch (error) {
      return next(error);
    }
  },

  async getArtById(req, res, next) {
    try {
      const { id } = req.params;
      const products = await models.Products.find({ userId: id }).exec();
      return successResponse(res, 200, products);
    } catch (error) {
      return next(error.message);
    }
  },

  // eslint-disable-next-line consistent-return
  async deleteArt(req, res, next) {
    const { id } = req.params;

    try {
      const objectId = mongoose.Types.ObjectId(id.toString());
      const isArt = await models.Transaction.findOne({ productId: objectId });
      if (isArt) {
        return errorHelper(
          res,
          403,
          'You cannot delete this Art because there is a transaction linked to it'
        );
      }

      const remove = await models.Products.deleteOne({ _id: objectId });
      if (remove) {
        return successResponse(res, 200, 'Art has been deleted');
      }
    } catch (error) {
      return next(error);
    }
  },
  async reduceArtQuantity(req, res, next) {
    const { id } = req.params;
    try {
      let updatedModels = null;
      const objectId = mongoose.Types.ObjectId(id.toString());
      const product = await models.Products.findById(objectId);
      const quantity = product.quantity;

      if (quantity >= 1) {
        updatedModels = await models.Products.findByIdAndUpdate(
          objectId,
          { quantity: quantity - 1 },
          { new: true }
        );
      } else {
        return errorHelper(res, 500, 'Art is no longer for sale');
      }
      return successResponse(res, 200, updatedModels);
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
  },

  async buyerBuyArt(req, res, next) {
    const { product } = req;
    try {
      const quantity = product.quantity - req.body.quantity;
      const artToBuy = await models.Transaction.create({
        ...req.body,
        productId: req.params.id
      }).then(async art => {
        if (art.status === 'completed') {
          await models.order.create({
            ...req.body,
            status: 'pending',
            productId: req.params.id,
            transactionId: art._id
          });
        }
      });
      merge(product, { quantity }).save();
      return successResponse(res, 201, artToBuy);
    } catch (error) {
      return next(error.message);
    }
  },

  async FetchArtBySchool(req, res, next) {
    const { id } = req.params;
    try {
      const objectId = mongoose.Types.ObjectId(id.toString());
      const school = await models.School.findOne({ userId: objectId });
      const art = await models.Products.find({ userId: school._id }).populate({
        path: 'userId',
        populate: {
          path: 'userId'
        }
      });
      if (art.length > 0) {
        return successResponse(res, 200, art);
      }
      return successResponse(res, 200, 'No Art for this school at the moment');
    } catch (error) {
      return next(error.message);
    }
  }
};

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
      const art = await models.Products.find({})
        .sort({ _id: -1 })
        .skip((page - 1) * pagination)
        .limit(pagination);
      const totalCount = await models.Products.countDocuments({});
      return successResponse(res, 200, { totalCount, page, itemsInPage: pagination, art });
    } catch (error) {
      return errorHelper(res, 401, error.message);
    }
  },

  async artSoldCollection(req, res, next) {
    const { id } = req.params;
    const {status} = req.query;
    try {
      let schoolOrders = null;
      if(status === 'all') {
        schoolOrders = await  models.order.find({schoolId: id})
        .populate('transactionId').populate('buyerId').exec();
      }else {
        schoolOrders = await models.order.find({schoolId: id, status})
          .populate('transactionId').populate('buyerId').exec();
      }
      return successResponse(res, 200, schoolOrders);
    } catch (error) {
      return next(error)
    }
  }
};

const mongoose = require("mongoose");
const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");
const orders = require('../../models/orders')
const artMail = require("../helpers/artmail");
const secret = require("../../config/keys");
const { getArtSold } = require('../helpers/artOrders');

module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;
 
    const { id }  = req.params;


    try {
      const objectId = mongoose.Types.ObjectId(id.toString());
     
      const transaction = await models.Transaction.findById(objectId)
        .populate("buyerId")
        .populate("productId");
     
      const order = await models.order.findOneAndUpdate(
        { transactionId: objectId },
        { status: "completed" },
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
    const schoolId  = req.params.id;
    try {
      const schoolOrders = await getArtSold(models.order, req, {schoolId}, 'buyerId')
      return successResponse(res, 200, schoolOrders);
    } catch (error) {
      return next(error)
    }
  },
  async artBoughtCollection(req, res, next) {
    const buyerId  = req.params.id;
    try {
      const schoolOrders = await getArtSold(models.order, req, {buyerId}, 'schoolId')
      return successResponse(res, 200, schoolOrders);
    } catch (error) {
      return next(error)
    }
  }
};

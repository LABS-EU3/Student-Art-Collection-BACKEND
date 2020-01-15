const mongoose = require("mongoose");
const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");
const artMail = require("../helpers/artmail");
const secret = require("../../config/keys");

module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;

    const { id } = req.params;

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
    const { id } = req.params;
    const { status } = req.query;
    try {
      let schoolOrders = null;
      if (status === "all") {
        schoolOrders = await models.order
          .find({ schoolId: id })
          .populate("transactionId")
          .populate("buyerId")
          .exec();
      } else {
        schoolOrders = await models.order
          .find({ schoolId: id, status })
          .populate("transactionId")
          .populate("buyerId")
          .exec();
      }
      return successResponse(res, 200, schoolOrders);
    } catch (error) {
      return next(error);
    }
  },

  async deleteArt(req, res, next) {
    const { id } = req.params;

    const { user } = req;
    try {
      const objectId = mongoose.Types.ObjectId(id.toString());
      const isArt = await models.Transaction.findOne({ productId: objectId });
      if (isArt) {
        return errorHelper(res, 500, "You cannot delete this product");
      }

      const remove = await models.Products.deleteOne({ _id: objectId });
      return remove;
    } catch (error) {
      return next(error);
    }
  },
  async reduceArtQuantity(req, res, next) {
    const { id } = req.params;
    const { user } = req;
    try {
      const objectId = mongoose.Types.ObjectId(id.toString());
      const product = await models.Products.findById(objectId);
      const quantity = product.quantity;
      if (quantity >= 1) {
        return models.Products.findByIdAndUpdate(
          objectId,
          { quantity: quantity - 1 },
          { new: true }
        );
      }
      errorHelper(res, 500, "Art is no longer for sale");
      return user;
    } catch (error) {
      return next(error);
    }
  }
};

const mongoose = require("mongoose");
const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");
const artMail = require("../helpers/artmail");
const secret = require("../../config/keys");

module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;

    const transactionid = req.params.id;

    try {
      const objectId = mongoose.Types.ObjectId(transactionid.toString());

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
  }
};

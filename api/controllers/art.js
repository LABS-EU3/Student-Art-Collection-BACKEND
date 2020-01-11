const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");
const artMail = require("../helpers/artmail");
const secret = require('../../config/keys')


module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;

    try {
      const order = await models.order
        .findOneAndUpdate(user.id, { status: "completed" }, { new: true })
        ;
      console.log(order);
      if (order) {
        const transaction = await models.Transaction.findById(order.transactionId);
        const products = await models.Products.findById(transaction.productId);
        artMail(secret.FRONTEND_BASE_URL,  req.email,
          req.name, products)

        return successResponse(res, 200, order)
      }
      return errorHelper(res, 500, "Transaction Not found");
    } catch (error) {
      return next(error.message);
    }
  }
};

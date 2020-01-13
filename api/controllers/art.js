const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");
const artMail = require("../helpers/artmail");
const secret = require("../../config/keys");

module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;

    try {
      const User = await models.User.findById(user.id);
      console.log(User);
      if (User) {
        // eslint-disable-next-line no-underscore-dangle
        const transaction = await models.Transaction.findOne({
          // eslint-disable-next-line no-underscore-dangle
          schoolId: User._id
        });
        console.log(transaction);
        const buyer = await models.Buyer.findOne({ _id: transaction.buyerId });
        console.log(buyer);
        console.log(transaction);
        const products = await models.Products.findOne({
          _id: transaction.productId
        });
        console.log(products);
        const order = await models.order.findOneAndUpdate(
          transaction.id,
          { status: "completed" },
          { new: true }
        );
        artMail(
          secret.FRONTEND_BASE_URL,
          User.email,
          buyer.firstname,
          products
        );

        return successResponse(res, 200, order);
      }
      return errorHelper(res, 500, "Transaction Not found");
    } catch (error) {
      return next(error.message);
    }
  }
};

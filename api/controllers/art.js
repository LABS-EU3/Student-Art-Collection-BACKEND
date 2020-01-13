const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");
const artMail = require("../helpers/artmail");
const secret = require("../../config/keys");

module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;

    try {
      const User = await models.User.findById(user.id);

      if (User.type === 'school') {
        // eslint-disable-next-line no-underscore-dangle
        const transaction = await models.Transaction.findOne({
          // eslint-disable-next-line no-underscore-dangle
          schoolId: User._id
        });

        const buyer = await models.Buyer.findOne({ _id: transaction.buyerId });

        const products = await models.Products.findOne({
          _id: transaction.productId
        });

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
      return errorHelper(res, 500, "You aren't authorised");
    } catch (error) {
      return next(error.message);
    }
  }
};

const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");


module.exports = {
  async markArtAsCollected(req, res, next) {
    const { user } = req;

    try {
      const order = await models.order
        .findOneAndUpdate(user.id, { status: "completed" }, { new: true })
        ;
      console.log(order);
      if (order) {
        return successResponse(res, 200, order)
      }
      return errorHelper(res, 500, "Transaction Not found");
    } catch (error) {
      return next(error.message);
    }
  }
};

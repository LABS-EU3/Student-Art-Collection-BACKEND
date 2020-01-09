const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");
const { sendEmailConfirmAccount } = require("../helpers/mail");

module.exports = {
  async markArtAsCollected(req, res, next) {
    try {
      const transaction = await models.order.findById(req.id).exec();
      if (transaction) {
        const newtransaction = { ...transaction, status: "completed" };
        sendEmailConfirmAccount();
        return newtransaction;
      }
      return errorHelper(res, 500, "Transaction Not found")
    } catch (error) {
      return next(error.message);
    }
  }
};

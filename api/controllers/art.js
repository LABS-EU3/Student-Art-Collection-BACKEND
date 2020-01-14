const { Buyer, User, Products, School } = require("../../models");
const { successResponse, errorHelper } = require("../helpers/response");

module.exports = {
  async getArtById(req, res, next) {
    try {
      const { id } = req.params;
      const products = await Products.find({ userId: id }).exec()
      if (!products.length) {
        return successResponse(res, 200, 'No products for sale')
      }
      return successResponse(res, 200, products);
    } catch (error) {
      return next(error.message);
    }
  }
};

const { Buyer, User, Products, School } = require("../../models");
const { successResponse, errorHelper } = require("../helpers/response");

// MODELS
const models = require("../../models/index");

// HELPERS

module.exports = {
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

  async getArtById(req, res, next) {
    try {
      const { id } = req.params;
      const products = await Products.find({ userId: id }).exec();
      if (!products.length) {
        return successResponse(res, 200, "No products for sale");
      }
      return successResponse(res, 200, products);
    } catch (error) {
      return next(error.message);
    }
  }
};

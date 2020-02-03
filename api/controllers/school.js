const mongoose = require("mongoose");
const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");

module.exports = {
  async FetchSchoolsByLocation(req, res) {
    const { user } = req;
    try {
      // const buyerLocation = user.location.coordinates;
      const schoolCloseBy = await models.User.aggregate()
        .near({
          near: [3,6],
          distanceField: "dist.calculated",
          maxDistance: 1000000,
          spherical: true
        })
        .match({ type: "school" });
      return successResponse(res, 200, schoolCloseBy);
    } catch (error) {
      return errorHelper(res, 401, error.message);
    }
  },
  async FetchAllSchools(req, res) {
    try {
      const schools = await models.School.find({});
      return successResponse(res, 200, schools);
    } catch (error) {
      return errorHelper(res, 401, error.message);
    }
  }
};

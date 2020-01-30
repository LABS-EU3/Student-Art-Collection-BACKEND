const mongoose = require("mongoose");
const { successResponse, errorHelper } = require("../helpers/response");
const models = require("../../models");

module.exports = {
  async Fetch(req, res) {
    try {
      const schools = await models.School.find({}).populate(
        "userId",
        "-password"
      );
      return successResponse(res, 200, schools);
    } catch (error) {
      return errorHelper(res, 401, error.message);
    }
  },
  async FetchSchoolsByLocation(req, res) {
    const { id } = req.params;
    try {
      const objectId = mongoose.Types.ObjectId(id.toString());
      console.log(objectId);
      const buyer = await models.Buyer.findOne({ _id: objectId }).populate(
        "userId"
      );
      console.log(buyer);
      const buyerLocation = buyer.userId.userLocation.location.coordinates;
      console.log(buyerLocation);
      const schools = await models.School.find({}).populate("userId");
      console.log(schools);
      const schoolCloseBy = await schools.aggregate([
        {
          $geoNear: {
             near: { type: "Point", coordinates:buyerLocation },
             distanceField: "distance",
             spherical: true
          }
        },
        { $limit: 5 }
     ])
      return successResponse(res, 200, schoolCloseBy)
    } catch (error) {
      return errorHelper(res, 401, error.message);
    }
  },

  async fetchSchools(req, res) {
    try {
      const {
        page,
        pagination,
        sortBy,
        sortType,
        searchQuery,
        filter
      } = req.query;
      const school = await models.School.find({
        [filter]: { $regex: searchQuery, $options: "i" }
      })
        .sort({ [sortBy]: sortType })
        .skip((page - 1) * pagination)
        .limit(pagination)
        .populate({
          path: "userId",
          populate: {
            path: "userId"
          }
        });
      const totalCount = await models.School.find({
        [filter]: { $regex: searchQuery, $options: "i" }
      }).countDocuments();
      return successResponse(res, 200, {
        totalCount,
        page,
        itemsInPage: pagination,
        school
      });
    } catch (error) {
      return errorHelper(res, 401, error.message);
    }
  }
};

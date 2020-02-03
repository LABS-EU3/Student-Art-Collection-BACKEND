const express = require("express");

const router = express.Router();
const schoolController = require("../controllers/school");
const userValidation = require("../validation/userValidator");

router.get(
  "/",
  [userValidation.validateUser],
  schoolController.FetchAllSchools
);
router.get(
  "/location/:id",
 
  schoolController.FetchSchoolsByLocation
);

module.exports = router;

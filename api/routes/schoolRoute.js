const express = require("express");

const router = express.Router();
const schoolController = require("../controllers/school");


router.get('/' ,schoolController.Fetch)
router.get('/location/:id', schoolController.FetchSchoolsByLocation)

module.exports = router;

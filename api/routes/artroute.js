const express = require("express");
const userValidators = require("../validation/userValidator");
const { getArtById } = require('../controllers/art')

const router = express.Router();

router.get(
  "/selling/:id",
  [userValidators.validateUser, userValidators.validateUserTokenRequest],
  getArtById
)

router.get(
  "/selling/sold",
  [userValidators.validateUser, userValidators.validateUserTokenRequest],
  getArtById
)

module.exports = router
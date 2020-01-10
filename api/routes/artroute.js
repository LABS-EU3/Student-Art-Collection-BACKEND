// DEPENDENCIES
const express = require('express');

// MIDDLEWARE
const artValidators = require('../validation/artValidation');
const userValidator = require('../validation/userValidator');

// CONTROLLERS
const artcontroller = require('../controllers/art');

const router = express.Router();
router.use(express.json());

// DUMMY ENDPOINT FOR TESTING PURPOSES
router.get('/test', artcontroller.testArt);

// UPLOAD NEW ART
router.post(
  '/upload',
  [userValidator.validateUser, artValidators.validateArtBody],
  artcontroller.uploadArt
);

module.exports = router;

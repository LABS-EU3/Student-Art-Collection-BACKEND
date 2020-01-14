// DEPENDENCIES
const express = require('express');
const cloudinary = require('../middleware/cloudinary');

// MIDDLEWARE
const artValidators = require('../validation/artValidation');
const userValidator = require('../validation/userValidator');

// CONTROLLERS
const artcontroller = require('../controllers/art');

const router = express.Router();
router.use(express.json());
// const upload = multer({ storage });

// UPLOAD NEW ART
router.post(
  '/upload/:id',
  [cloudinary.uploadImage('image')],
  [
    userValidator.validateUser,
    userValidator.validateUserTokenRequest,
    artValidators.validateArtBody
  ],
  artcontroller.uploadArt
);

router.get(
  '/sold/order/:id',
  [userValidator.validateUser],
  artcontroller.artSoldCollection
);

// SEARCH ART
router.get('/search', artValidators.validateArtFilter, artcontroller.searchArt);

module.exports = router;

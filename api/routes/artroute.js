const express = require("express");
const userValidators = require("../validation/userValidator");
const { getArtById } = require('../controllers/art')

const router = express.Router();

module.exports = router
// DEPENDENCIES
const cloudinary = require('../middleware/cloudinary');

// MIDDLEWARE
const artValidators = require('../validation/artValidation');
const userValidator = require('../validation/userValidator');

// CONTROLLERS
const artcontroller = require('../controllers/art');

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

router.get('/sold/order/:id', [userValidator.validateUser],artcontroller.artSoldCollection)

router.get(
  "/selling/:id",
  [userValidators.validateUser],
  getArtById
)

module.exports = router;


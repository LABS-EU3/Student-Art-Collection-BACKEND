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
    // COMMENTED OUT SIBCE IT WOULD CLASH WITH THE SCHOOL ID BEING PASSED AS PARAM IN THE ART UPLOAD IP CALL FROM FRONTEND
    // userValidator.validateUserTokenRequest, 
    artValidators.validateArtBody
  ],
  artcontroller.uploadArt
);

// FETCH ALL ART WITH PAGINATION INCLUDED
router.get('/', artcontroller.fetchArt);

module.exports = router;

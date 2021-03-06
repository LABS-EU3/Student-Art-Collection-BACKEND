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

    // COMMENTED OUT SIBCE IT WOULD CLASH WITH THE SCHOOL ID BEING PASSED AS PARAM IN THE ART UPLOAD IP CALL FROM FRONTEND
    // userValidator.validateUserTokenRequest,
    artValidators.validateArtBody
  ],
  artcontroller.uploadArt
);

// FETCH ALL ART WITH PAGINATION INCLUDED
router.get('/', artcontroller.fetchArt);
router.get('/sold/order/:id',artcontroller.artSoldCollection)
router.delete('/product/:id', [userValidator.validateUser], artcontroller.deleteArt);
router.put('/quantity/:id', [userValidator.validateUser], artcontroller.reduceArtQuantity)

router.get('/sold/order/buyer/:id',[userValidator.validateUser],artcontroller.artBoughtCollection)
router.get(
  '/sold/order/:id',
  [userValidator.validateUser],
  artcontroller.artSoldCollection
);
router.delete(
  '/product/:id',
  [userValidator.validateUser],
  artcontroller.deleteArt
);
router.put(
  '/quantity/:id',
  [userValidator.validateUser],
  artcontroller.reduceArtQuantity
);

router.get('/school/art/:id', artcontroller.FetchArtBySchool)
router.get(
  "/selling/:id",
  [userValidators.validateUser],
  getArtById
)


// SEARCH ART
router.get(
  '/search',
  [
    artValidators.validatePagination,
    artValidators.validateSort,
    artValidators.validateFilter,
    artValidators.validateSearchQuery
  ],
  artcontroller.fetchArt
);

router.post('/buyart/:id', [userValidator.validateUser],[artValidators.ValidateIfArtExists, artValidators.validateProductBuyItem,artValidators.validateProductQuantity],artcontroller.buyerBuyArt)
router.put('/edit/:id', [userValidator.validateUser,artValidators.validateArtBody, artValidators.ValidateIfArtExists], artcontroller.editArt)


module.exports = router;

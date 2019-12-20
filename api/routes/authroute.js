const express = require("express");
const authUser = require('../helpers/jwt');
const controller = require('../controllers/user');
const userValidators = require('../validation/userValidator');
const cloudinary = require('../middleware/cloudinary');

const router = express.Router();
// eslint-disable-next-line no-unused-vars
router.post("/signup",[userValidators.validateUserOnSignup, userValidators.validateUserBuyerSchool], controller.createUser);
router.post("/login", [userValidators.loginCredentials],controller.loginUser);
router.post("/upload/:id", [userValidators.validateUser, userValidators.validateUserTokenRequest],[cloudinary.uploadImage('image'),cloudinary.deleteCloudImage],controller.photoUpload)
router.patch("/confirm", controller.activateUser);

router.post(
  '/resetpassword',
  [userValidators.validateUserEmail],
  controller.sendPasswordMail
);
router.patch('/newpassword',[userValidators.validatePassword], controller.resetPassword)

router.patch("/updateProfile/:id", [userValidators.validateUser, userValidators.validateUserTokenRequest],controller.updateProfile);


module.exports = router;

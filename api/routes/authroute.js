const express = require("express");
const passport = require("passport");

const controller = require("../controllers/user");

const artController = require("../controllers/art");

const userValidators = require("../validation/userValidator");
const Oauthcontroller = require("../controllers/Oauth");
const cloudinary = require("../middleware/cloudinary");

const router = express.Router();
// eslint-disable-next-line no-unused-vars
router.use(passport.initialize());
router.post(
  "/signup",
  [userValidators.validateUserOnSignup, userValidators.validateUserBuyerSchool],
  controller.createUser
);

router.post("/login", [userValidators.loginCredentials], controller.loginUser);
router.post(
  "/upload/:id",
  [userValidators.validateUser, userValidators.validateUserTokenRequest],
  [cloudinary.uploadImage("image"), cloudinary.deleteCloudImage],
  controller.photoUpload
);
router.patch("/confirm", controller.activateUser);

// Facebook
// router.get("/auth/facebook", passport.authenticate("facebook"));

// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   Oauthcontroller.socialAuthlogin
// );

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  Oauthcontroller.socialAuthlogin
);

router.post(
  "/resetpassword",
  [userValidators.validateUserEmail],
  controller.sendPasswordMail
);
router.patch(
  "/newpassword",
  [userValidators.validatePassword],
  controller.resetPassword
);

router.patch(
  "/updateProfile/:id",
  [userValidators.validateUser, userValidators.validateUserTokenRequest],
  controller.updateProfile
);

router.get(
  "/profile/:id",
  [userValidators.validateUser, userValidators.validateUserTokenRequest],
  controller.getAuser
);

router.get(
  "/profile/mark/:id",
  userValidators.validateUser,
  artController.markArtAsCollected
);

module.exports = router;

const express = require("express");
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;
const controller = require("../controllers/user");
const userValidators = require("../validation/userValidator");
const Oauthcontroller = require("../controllers/Oauth");
const cloudinary = require("../middleware/cloudinary");
const callBackStrategy = require("../middleware/facebookStratey");

// passport.use(
//   new Strategy(
//     {
//       clientID: keys.FACEBOOK_APP_ID,
//       clientSecret: keys.FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback/",
//       profileFields: ["id", "last_name", "first_name", "email"]
//     },
//     function(accessToken, refreshToken, profile, cb) {
   
//       return callBackStrategy(profile, cb);
//     }
//   )
// );






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

module.exports = router;

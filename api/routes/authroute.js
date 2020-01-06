const express = require("express");
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const controller = require("../controllers/user");
const userValidators = require("../validation/userValidator");
const Oauthcontroller = require("../controllers/Oauth");
const cloudinary = require("../middleware/cloudinary");
const keys = require("../../config/keys");
const callBackStrategy = require("../middleware/facebookStratey");
const models = require("../../models");

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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.User.findById(id)
    .then(user => {
      done(null, user.id);
    })
    .catch(err => console.log(err));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, cb) => {
      models.User.findOne({ email: profile.emails[0].value })
        .then(existingUser => {
          if (existingUser) {
            cb(null, existingUser);
          } else {
            new models.User({
              email: profile.emails[0].value,
              type: "buyer",
              confirmed: true,
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              auth_id: profile.id
            })
              .save()
              .then(newUser => {
                cb(null, newUser);
              });
          }
        })
        .catch(err => console.log(err));
    }
  )
);

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

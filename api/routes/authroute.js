const express = require("express");
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const controller = require('../controllers/user');
const userValidators = require('../validation/userValidator');
const Oauthcontroller = require('../controllers/Oauth');
const cloudinary = require('../middleware/cloudinary');
const keys = require("../../config/keys");
const callBackStrategy = require("../middleware/facebookStratey")
const models = require("../../models");




passport.use(new Strategy({
  clientID: keys.FACEBOOK_APP_ID,
  clientSecret: keys.FACEBOOK_APP_SECRET,
  callbackURL: 'https://tobi-server.herokuapp.com/auth/facebook/callback/',
  profileFields: ["id", "last_name", "first_name", "email"]
},
function(accessToken, refreshToken, profile, cb) {
  // In this example, the user's Facebook profile is supplied as the user
  // record.  In a production-quality application, the Facebook profile should
  // be associated with a user record in the application's database, which
  // allows for account linking and authentication with other identity
  // providers.
  return callBackStrategy(profile, cb);
}));

passport.serializeUser((user, done) => {
   done(null, user.id);
 });
  
 passport.deserializeUser((id, done) => {
   models.User.findById(id, (err, user) => {
     done(err, user);
   });
 });

const router = express.Router();
// eslint-disable-next-line no-unused-vars
router.post("/signup",[userValidators.validateUserOnSignup, userValidators.validateUserBuyerSchool], controller.createUser);


router.post("/login", [userValidators.loginCredentials],controller.loginUser);
router.post("/upload/:id", [userValidators.validateUser, userValidators.validateUserTokenRequest],[cloudinary.uploadImage('image'),cloudinary.deleteCloudImage],controller.photoUpload)
router.patch("/confirm", controller.activateUser);


 // Facebook
 router.get('/auth/facebook',
 passport.authenticate('facebook'));
  
router.get(
   '/auth/facebook/callback',
   passport.authenticate('facebook', { failureRedirect: '/login' }),
   function(req, res) {
    res.redirect('https://artfunder-development.netlify.com/');
  }
 );

 router.post(
 '/resetpassword',
 [userValidators.validateUserEmail],
 controller.sendPasswordMail
 );
 router.patch('/newpassword',[userValidators.validatePassword], controller.resetPassword)

 router.patch("/updateProfile/:id", [userValidators.validateUser, userValidators.validateUserTokenRequest],controller.updateProfile);

 router.get('/profile/:id', [userValidators.validateUser, userValidators.validateUserTokenRequest], controller.getAuser)

module.exports = router;

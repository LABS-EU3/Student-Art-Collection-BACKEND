const express = require("express");
const passport = require('passport');
const controller = require('../controllers/user');
const userValidators = require('../validation/userValidator');
const Oauthcontroller = require('../controllers/Oauth');

const router = express.Router();
// eslint-disable-next-line no-unused-vars
router.post("/signup",[userValidators.validateUserOnSignup, userValidators.validateUserBuyerSchool], controller.createUser);

router.post("/login", controller.loginUser);
router.patch("/confirm", controller.activateUser);

// Facebook
router.get('/facebook', [
    passport.authenticate('facebook', {
      scope: ['email']
    })
  ]);
  
  router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    Oauthcontroller.socialAuthlogin
  );


module.exports = router;
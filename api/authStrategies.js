const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

function facebookStrategy() {
  return passport.use(new FacebookStrategy({}));
}

function googleStrategy() {
  return passport.use(new GoogleStrategy({}));
}

module.exports = {
  facebookStrategy,
  googleStrategy
};

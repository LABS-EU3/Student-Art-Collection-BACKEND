const passport = require("passport");
const FaceBookStrategy = require("passport-facebook").Strategy;

const models = require("../../models");
const keys = require("../../config/keys");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.Users.findByPk(id, (err, user) => {
    done(err, user);
  });
});

async function callbackStrategy(profile, cb) {
  const email = profile.emails[0].value;

  try {
    const existingUser = await models.Users.findOne({ where: { email } });
    if (!existingUser) {
      const newUser = await models.Users.findOrCreate({
        where: { auth_id: profile.id },
        defaults: {
          username: profile.username,
          email,
          password: " "
        }
      });
      if (!newUser) {
        return new Error();
      }
      return cb(null, newUser);
    }
    return cb(null, existingUser);
  } catch (error) {
    return cb(error, null);
  }
}

function facebookStrategy() {
  return new FaceBookStrategy(
    {
      clientID: keys.FACEBOOK_APP_ID,
      clientSecret: keys.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "last_name", "first_name", "email"]
    },
    (accessToken, refreshToken, profile, cb) => {
      // Make sure there is a username, needed to create a new user
      if (!profile.username) {
        const newUsername = `${profile.name.familyName}${profile.name.givenName}`;
        // eslint-disable-next-line no-param-reassign
        profile = { ...profile, username: newUsername };
      }
      console.log(profile.username);
      return callbackStrategy(profile, cb);
    }
  );
}

module.exports = {
  facebookStrategy
};

/* eslint-disable no-new */
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require('passport')
const models = require('../../models');
const keys = require('../../config/keys');

module.exports = {
    authCallbackStrategy() {
        passport.use(
            new GoogleStrategy(
              {
                clientID: keys.GOOGLE_CLIENT_ID,
                clientSecret: keys.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
                passReqToCallback: true
              },
               function (_, __, ___, profile, cb) {
                models.User.findOne({ email: profile.emails[0].value })
                .then(existingUser => {
                  if (existingUser) {
                    return cb(null, existingUser);
                  } 
                    return models.User.create({
                      email: profile.emails[0].value,
                      type: "buyer",
                      confirmed: true,
                      // firstname: profile.name.givenName,
                      // lastname: profile.name.familyName,
                      auth_id: profile.id
                    })
                      .then(newUser => newUser)
                      .then((buyer) =>{
                          return models.Buyer.create({
                              // eslint-disable-next-line no-underscore-dangle
                              userId: buyer._id,
                              firstname: profile.name.givenName,
                              lastname: profile.name.familyName,
                          }).then(() => cb(null, buyer));
                      });
                })
                .catch(err => console.log(err));
            }
            )
          );
    }
}
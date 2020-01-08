// const passport = require("passport");
// const FaceBookStrategy = require("passport-facebook").Strategy;

//  const models = require("../../models");
// const keys = require("../../config/keys");

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   models.User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// async function callbackStrategy(profile, cb) {
//   const email = profile.emails[0].value;

//   try {
//     const existingUser = await models.User.findOne({ email }).exec();
//     console.log(existingUser)
//     if (!existingUser) {
//       let newUser = await models.User.create({
//         email,
//         type: "buyer",
//         confirmed: true,
//         firstname: profile.name.givenName,
//         lastname: profile.name.familyName,
//         auth_id: profile.id
//       });
//       [newUser] = newUser;
//       console.log(newUser)

//       if (!newUser) {
//         return new Error();
//       }
//       return cb(null, newUser);
//     }
//     return cb(null, existingUser);
//   } catch (error) {
//     return cb(error, null);
//   }
// }

// function facebookStrategy() {
//   return passport.use(new FaceBookStrategy(
//     {
//       clientID: keys.FACEBOOK_APP_ID,
//       clientSecret: keys.FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "last_name", "first_name", "email"]
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       return callbackStrategy(profile, cb);
//     }
//   ));
// }

//  module.exports = {
//  callbackStrategy,

//  };

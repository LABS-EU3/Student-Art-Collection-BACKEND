// const passport = require("passport");
// const FaceBookStrategy = require("passport-facebook").Strategy;

 const models = require("../../models");
// const keys = require("../../config/keys");

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   models.User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

 async function callbackStrategy(profile, cb) {
   const email = profile.emails[0].value;

   try {
     // eslint-disable-next-line object-shorthand
     const existingUser = await (await models.User.findOne({ email: email})).exec()
     if (!existingUser) {
       const newUser = await models.User.create({_id: profile.id, email, password: ''});
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

 module.exports = {
 callbackStrategy
 };

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



//   passport.use(new FaceBookStrategy(
//     {
//       clientID: keys.FACEBOOK_APP_ID,
//       clientSecret: keys.FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "last_name", "first_name", "email"]
//     },
//     function (_, __, ___, profile, cb) {
//         models.User.findOne({ email: profile.emails[0].value })
//         .then(existingUser => {
//           if (existingUser) {
//             return cb(null, existingUser);
//           } 
//             return models.User.create({
//               email: profile.emails[0].value,
//               type: "buyer",
//               confirmed: true,
//               auth_id: profile.id
//             })
//               .then(newUser => newUser)
//               .then((buyer) =>{
//                   return models.Buyer.create({
//                       // eslint-disable-next-line no-underscore-dangle
//                       userId: buyer._id,
//                       firstname: profile.name.givenName,
//                       lastname: profile.name.familyName,
//                   }).then(() => cb(null, buyer));
//               });
//         })
//         .catch(err => console.log(err));
//     }
//     )
//   );




const models = require('../../models');

module.exports = {
    authCallbackStrategy(request, accessToken, refreshToken, profile, cb) {
        return models.User.findOne({ email: profile.emails[0].value })
          .then(existingUser => {
              console.log(existingUser)
            if (existingUser) {
              return cb(null, existingUser);
            } 
              return new models.User({
                email: profile.emails[0].value,
                type: "buyer",
                confirmed: true,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                auth_id: profile.id
              })
                .save()
                .then(newUser => cb(null, newUser));
          })
          .catch(err => console.log(err));
      }
}
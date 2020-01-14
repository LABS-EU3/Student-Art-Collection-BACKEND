const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

// ROUTES
const UserauthRoute = require('./authroute');
const ArtRoute = require('./artroute');
const ContactRoute = require('./contactRoute');
const models = require('../../models')
const {authCallbackStrategy} = require('../middleware/googleStrategy');

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

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

authCallbackStrategy();

app.use('/', UserauthRoute);
app.use('/art', ArtRoute);
app.use('/', ContactRoute);

app.use(function errors(err, req, res, next) {
  return res.status(500).json({ err });
});

module.exports = app;

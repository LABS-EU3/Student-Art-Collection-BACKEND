// DEPENDENCIES
const stripe = require('stripe')('sk_test_aMqnc5Qsd2DQrAB48V1dYljL00w2vvfZ63');
const mongoose = require('mongoose');

// MODELS
const models = require('../../models/index');

module.exports = {
  async fetchConnectedAccountCredentials(req, res, next) {
    const { authCode } = req.query;
    const { id } = req.params;
    try {
      const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: authCode
      });
      const objectId = mongoose.Types.ObjectId(id.toString());
      const school = await models.School.findByIdAndUpdate(objectId, {
        stripe_user_id: response.stripe_user_id
      }, {new: true});
      res.status(200).json(school);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
};

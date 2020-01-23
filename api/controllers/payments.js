// DEPENDENCIES
const stripeapi = require('stripe');
const mongoose = require('mongoose');

// MODELS
const models = require('../../models/index');

// HELPERS
const config = require('../../config/keys');
const { errorHelper, successResponse } = require('../helpers/response');

const stripe = stripeapi(config.STRIPE_API_KEY);

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
      const school = await models.School.findByIdAndUpdate(
        objectId,
        {
          stripe_user_id: response.stripe_user_id
        },
        { new: true }
      );
      successResponse(res, 200, school);
    } catch (error) {
      next(error.message);
    }
  },

  async createPaymentIntent(req, res, next) {
    const { price, currency, stripeUserId } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create(
        {
          payment_method_types: ['card'],
          amount: price * 100,
          currency
        },
        {
          stripeAccount: stripeUserId
        }
      );

      const clientSecret = paymentIntent.client_secret;
      successResponse(res, 200, {
        message: 'Payment Intent created succesfully',
        clientSecret
      });
    } catch (error) {
      next(error.message);
    }
  }
};

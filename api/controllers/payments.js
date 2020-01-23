const config = require('../../config/keys');

// DEPENDENCIES
const stripe = require('stripe')(config.STRIPE_API_KEY);
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
      const school = await models.School.findByIdAndUpdate(
        objectId,
        {
          stripe_user_id: response.stripe_user_id
        },
        { new: true }
      );
      res.status(200).json(school);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  //   async makePaymentConnectedAccount(req, res, next) {
  //     const { price, currency, stripeUserId } = req.body;
  //     try {
  //       const paymentIntent = stripe.paymentIntents.create(
  //         {
  //           payment_method_types: ['card'],
  //           amount: price * 100,
  //           currency
  //         },
  //         {
  //           stripe_account: stripeUserId
  //         }
  //       );
  //       res.status(200).json(paymentIntent);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
};

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
    const { authCode, id } = req.body;
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
    const { totalAmount, stripeUserId, metadata } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create(
        {
          payment_method_types: ['card'],
          amount: totalAmount * 100, // converts price in cents, as required by Stripe's API
          currency: 'usd',
          metadata
        },
        {
          stripeAccount: stripeUserId
        }
      );
      const clientSecret = paymentIntent.client_secret;
      const paymentIntentId = paymentIntent.id;
      const transaction = await models.Transaction.create({
        ...req.body,
        productId: req.params.id,
        status: 'pending',
        paymentIntentId
      });
      successResponse(res, 200, {
        message: 'Payment Intent created successfully',
        clientSecret,
        transaction
      });
    } catch (error) {
      next(error.message);
    }
  },
  async stripeWebhooks(req, res, next) {
    const event = req.body;
    const intent = event.data.object;
    const paymentIntentId = intent.id;
    const metadata = intent.metadata;
    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          successResponse(res, 200, {});
          const transaction = await models.Transaction.findOneAndUpdate(
            { paymentIntentId },
            { status: 'completed' },
            { new: true }
          );
          await models.order.create({
            transactionId: transaction.id,
            productId: metadata.product.id,
            buyerId: metadata.buyer.id,
            SchoolId: metadata.school.id,
            status: 'completed',
            totalAmount: intent.amount / 100
          });
          break;
        }
        case 'payment_intent.payment_failed': {
          successResponse(res, 200, {});
          await models.Transaction.findOneAndUpdate(
            { paymentIntentId },
            { status: 'failed' }
          );
          break;
        }
        default: {
          res.status(400).end();
        }
      }
    } catch (error) {
      errorHelper(res, 500, error);
    }
  }
};

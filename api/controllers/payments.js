// DEPENDENCIES
const stripeapi = require('stripe');
const mongoose = require('mongoose');

// MODELS
const models = require('../../models/index');

// HELPERS
const config = require('../../config/keys');
const { errorHelper, successResponse } = require('../helpers/response');
const paymentsMail = require('../helpers/paymentsmail');

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
    const { totalAmount, stripeUserId } = req.body;
    const SchoolId = req.body.schoolId;
    try {
      const paymentIntent = await stripe.paymentIntents.create(
        {
          payment_method_types: ['card'],
          amount: totalAmount * 100, // converts price in cents, as required by Stripe's API
          currency: 'usd'
        },
        {
          stripeAccount: stripeUserId
        }
      );
      const clientSecret = paymentIntent.client_secret;
      const paymentIntentId = paymentIntent.id;
      const transaction = await models.Transaction.create({
        ...req.body,
        SchoolId,
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
    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          successResponse(res, 200, {});
          const transaction = await models.Transaction.findOneAndUpdate(
            { paymentIntentId },
            { status: 'completed' },
            { new: true }
          )
            .populate({
              path: 'buyerId',
              populate: {
                path: 'userId'
              }
            })
            .populate({
              path: 'SchoolId',
              populate: {
                path: 'userId'
              }
            })
            .populate('productId');

          if (transaction) {
            try {
              await Promise.all([
                models.order.create({
                  transactionId: transaction._id,
                  productId: transaction.productId._id,
                  buyerId: transaction.buyerId._id,
                  SchoolId: transaction.SchoolId._id,
                  status: 'pending',
                  totalAmount: intent.amount / 100
                }),
                paymentsMail.artPurchaseConfirmationMailBuyer(
                  config.FRONTEND_BASE_URL,
                  transaction.buyerId.userId.email,
                  transaction.buyerId.firstname,
                  transaction.productId
                ),
                paymentsMail.artPurchaseConfirmationMailSchool(
                  config.FRONTEND_BASE_URL,
                  transaction.SchoolId.userId.email,
                  transaction.buyerId.userId.email,
                  transaction.SchoolId.name,
                  transaction.productId
                )
              ]);
            } catch (error) {
              next(error.message);
            }
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          successResponse(res, 200, {});
          const transaction = await models.Transaction.findOneAndUpdate(
            { paymentIntentId },
            { status: 'failed' },
            { new: true }
          )
            .populate({
              path: 'buyerId',
              populate: {
                path: 'userId'
              }
            })
            .populate({
              path: 'SchoolId',
              populate: {
                path: 'userId'
              }
            })
            .populate('productId');
          if (transaction) {
            try {
              await paymentsMail.artPurchaseFailureMail(
                config.FRONTEND_BASE_URL,
                transaction.buyerId.userId.email,
                transaction.buyerId.firstname,
                transaction.productId
              );
            } catch (error) {
              next(error.message);
            }
          }
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

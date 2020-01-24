// DEPENDENCIES
const express = require('express');

// CONTROLLERS
const paymentscontroller = require('../controllers/payments');

// VALIDATORS
const userValidator = require('../validation/userValidator');
const artValidators = require('../validation/artValidation');

const router = express.Router();

router.use(express.json());

router.post(
  '/fetchcredentials',
  [userValidator.validateUser],
  paymentscontroller.fetchConnectedAccountCredentials
);

router.post(
  '/paymentintent',
  [
    userValidator.validateUser,
    artValidators.ValidateIfArtExists,
    artValidators.validateProductBuyItem,
    artValidators.validateProductQuantity
  ],
  paymentscontroller.createPaymentIntent
);

router.post('/hooks', paymentscontroller.stripeWebhooks);

module.exports = router;

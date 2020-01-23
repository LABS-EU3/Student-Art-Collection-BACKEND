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
  '/fetchcredentials/:id',
  [userValidator.validateUser],
  paymentscontroller.fetchConnectedAccountCredentials
);

router.post(
  '/:id/paymentintent',
  [
    userValidator.validateUser,
    artValidators.ValidateIfArtExists,
    artValidators.validateProductBuyItem,
    artValidators.validateProductQuantity
  ],
  paymentscontroller.createPaymentIntent
);

module.exports = router;

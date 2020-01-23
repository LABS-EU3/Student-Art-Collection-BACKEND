// DEPENDENCIES
const express = require('express');

// CONTROLLERS
const paymentscontroller = require('../controllers/payments');

// VALIDATORS
const userValidator = require('../validation/userValidator');

const router = express.Router();

router.use(express.json());

router.post(
  '/fetchcredentials/:id',
  [userValidator.validateUser],
  paymentscontroller.fetchConnectedAccountCredentials
);

module.exports = router;

// DEPENDENCIES
const express = require('express');

// CONTROLLERS
const paymentscontroller = require('../controllers/payments');

const router = express.Router();

router.use(express.json());

router.post(
  '/fetchcredentials',
  paymentscontroller.fetchConnectedAccountCredentials
);

module.exports = router;

// DEPENDENCIES
const express = require('express');

// MIDDLEWARE
const router = express.Router();

// CONTROLLERS
const artcontroller = require('../controllers/art');

router.use(express.json());

router.get('/test', artcontroller.testArt);

module.exports = router;

// DEPENDENCIES
const express = require('express');

// MIDDLEWARE
const router = express.Router();

// CONTROLLERS
const artcontroller = require('../controllers/art');

router.use(express.json());

// DUMMY ENDPOINT FOR TESTING PURPOSES
router.get('/test', artcontroller.testArt);

// UPLOAD NEW ART
router.post('/:id/upload', artcontroller.uploadArt);

module.exports = router;

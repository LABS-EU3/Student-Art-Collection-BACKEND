const express = require("express");
const authUser = require('../helpers/jwt');
const controller = require('../controllers/user');
const userValidators = require('../validation/userValidator');

const router = express.Router();
// eslint-disable-next-line no-unused-vars
router.post("/signup",[userValidators.validateUserOnSignup], controller.createUser);


module.exports = router;
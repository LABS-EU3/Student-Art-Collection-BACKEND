const express = require("express");
const passport = require("passport");
const contactController = require("../controllers/contact");
const contactValidators = require("../validation/contactFormValidator");

const router = express.Router();
router.use(passport.initialize());

router.post(
  "/contactus",
  [contactValidators.validateContactForm],
  contactController.sendContactMessage
)

module.exports = router;

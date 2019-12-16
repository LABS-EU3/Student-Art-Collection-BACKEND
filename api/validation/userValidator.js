const Validator = require("validatorjs");

async function validateUserEmail(req, res, next) {
  // Destructure email from request body here
  const validator = new Validator(req.body, {
    email: "required|email"
  });
  if (validator.fails()) {
    res.status(400).json({
      error: "Input a valid email"
    });
  }
  try {
    // Find user with email here using Model and set model to user
    //     if (!user) {
    //       res.status(404).json({
    //         error: "User not found"
    //       });
    //     }
    //     req.userEmail = user;
    return next();
  } catch (error) {
    return next({ message: "Server error try again" });
  }
}

function validatePassword(req, res, next) {
  const { body } = req;
  const validator = new Validator(body, {
    password: "required|min:5"
  });
  if (validator.fails()) {
    res.status(400).json({
      error: "Password must be at least 5 characters"
    });
  }
  return next();
}

module.exports = {
  validateUserEmail,
  validatePassword
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

async function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email
  };

  const options = {
    expiresIn: "5d"
  };

  const token = await jwt.sign(payload, process.env.JWT_Secret, options);
  return token;
}

async function authorizeUser(req, res, next) {
  const { token } = req.headers;
  if (!token) {
    res.status(401).json({
      error: "Token is required"
    });
  }
  try {
    const decode = await jwt.verify(token, process.env.JWT_Secret);
    req.decode = decode;
  } catch (error) {
    res.status(401).json({
      error: "Token Error"
    });
  }
  try {
    const { username } = req.params;
    if (username !== req.decode.username) {
      res.status(401).json({
        error: "User denied Access"
      });
    }
    return next();
  } catch (error) {
    return next({ message: "Error validating User" });
  }
}

module.exports = {
  generateToken,
  authorizeUser
};

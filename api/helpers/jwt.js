const jwt = require("jsonwebtoken");
const { JWTSecret } = require('../../config/keys');

async function generateToken(user) {
  const payload = {
    subject: user.id,
    // email: user.email
  };

  const options = {
    expiresIn: "5d"
  };
  try {
    const token = await jwt.sign(payload,JWTSecret, options);
    return token;
  } catch (error) {
     return error.message;
  }
}
module.exports = {
  generateToken
};

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
module.exports = {
  generateToken
 
};

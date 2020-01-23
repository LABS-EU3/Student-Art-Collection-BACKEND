const stripe = require('stripe')('sk_test_aMqnc5Qsd2DQrAB48V1dYljL00w2vvfZ63');

module.exports = {
  async fetchConnectedAccountCredentials(req, res, next) {
    const { authCode } = req.query;
    try {
      const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: authCode
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
};

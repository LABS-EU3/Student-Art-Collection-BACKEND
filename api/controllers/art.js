// MODELS
const models = require('../../models/index');

module.exports = {
  testArt(req, res) {
    res.status(200).json({ message: 'hello from endpoint' });
  }
};

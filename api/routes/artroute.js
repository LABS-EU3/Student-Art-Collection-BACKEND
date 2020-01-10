// DEPENDENCIES
const express = require('express');

// MIDDLEWARE

const router = express.Router();

router.use(express.json());

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'hello from endpoint' });
});

module.exports = router;

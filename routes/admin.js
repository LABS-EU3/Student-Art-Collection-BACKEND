const path = require('path');

const express = require('express');

const router = express.Router();



router.get('/admin', (req, res) => res.json({ msg: 'Welcome admin' }));


module.exports = router;


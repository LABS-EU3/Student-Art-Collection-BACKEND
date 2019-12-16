const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin')


const router = express.Router();

router.post('/add-user', adminController.AddUser)



router.get('/', (req, res) => res.json({ msg: 'Welcome admin' }));


module.exports = router;

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.json({ msg: 'Welcome user' });
};

exports.postLogin = (req, res, next) => {
	res.json({ msg: 'logged in' });
};

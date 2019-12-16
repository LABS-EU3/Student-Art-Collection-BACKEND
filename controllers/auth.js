const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/db')

	async function logIn(req, res) {
		User.findOne({
			username: req.body.username
		}, (err, user) => {
			if (err) throw err;
			if (!user) {
				res.status(401).send({ success: false, msg: 'Authentication failed. User not found.'});
			} else {
				user.comparePassword(req.body.password, (isMatch) => {
					if (isMatch && !err) {
						const token = jwt.sign(user.toJSON(), config.secret, {expiresIn: '60d'});
						res.json({ success: true, token: `JWT${  token}`});
					} else {
						res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
					}
				});
			}
		});
	}


export default logIn;
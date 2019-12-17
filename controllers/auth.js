const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/db')

	async function logIn(req, res, next) {
		try {
			const user = await User.findOne({email: req.body.email}).exec()
			if(!user) {
				return res.status(404).json('user not found')
			}

		} catch (error){
	
		next({error: 'server error'})
		}
		return User;
	}
	
	// 	const user = await User.findOne({
	// 		username: req.body.email
	// 	}, 
	// 	(err, user) => {
	// 		if (err) throw err;
	// 		if (!user) {
	// 			res.status(401).send({ success: false, msg: 'Authentication failed. User not found.'});
	// 		} else {
	// 			user.comparePassword(req.body.password, (isMatch) => {
	// 				if (isMatch && !err) {
	// 					const token = jwt.sign(user.toJSON(), config.secret, {expiresIn: '60d'});
	// 					res.json({ success: true, token: `JWT${  token}`});
	// 				} else {
	// 					res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
	// 				}
	// 			});
	// 		}
	// 	});
	// }


export default logIn;
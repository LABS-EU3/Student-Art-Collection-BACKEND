const User = require('../models/user');

exports.AddUser = (req, res, next) => {
	const name = req.body.name;
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const confirmed = req.body.confirmed;
	const profilePicture = req.body.profilePicture;
	const location = req.body.location;
	const description = req.body.description;
	const createdAt = req.body.createdAt;
	const user = new User({
		name,
		username,
		email,
		password,
		confirmed,
		profilePicture,
		location,
		description,
		createdAt,
	});
	user
		.save()
		.then((result) => {
			console.log(result);
			console.log('User created');
			res.redirect('/');
		})
		.catch((err) => {
			console.log(err);
		});
};

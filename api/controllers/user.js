
const bcrypt = require('bcryptjs');

const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const multerUploads = require('multer');
const models = require('../../models/user');


const { config, cloudinaryConfig, uploader } = require('../../config/cloudinaryConfig');
const User = require('../../models/user');

const { generateToken } = require('../helpers/jwt');



const storage = multerUploads.diskStorage({
	destination (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename (req, file, cb) {
		cb(null, file.originalname);
	},
});


module.exports = {
	async createUser (req, res) {
		try {
			const hash = bcrypt.hashSync(req.body.password, 10);
			const createUser = {
				...req.body,
				email: req.body.email.toLowerCase(),
				password: hash,
			};
			const user = await models.create(createUser);
			if (user) {
				const newUser = {
					username: user.name,
					email: user.email,
					id: user.id,
				};

				const token = await generateToken(newUser);
				res.status(201).json({
					user: newUser,
					token,
				});
			}
			res.status(400).json({
				error: 'Could not create Profile',
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
			});
		}
	},

	photoUpload (req, res, next) {
		const upload = multerUploads({ storage }).single('name-of-input-key');
		upload(req, res,  (err) =>{
			if (err) {
				return res.send(err);
			}
			cloudinary.config({
				cloud_name: cloudinaryConfig().cloud_name,
				api_key: cloudinaryConfig().api_key,
				api_secret: cloudinaryConfig().api_secret,
			});

			const path = req.file.path;
			const uniqueFilename = new Date().toISOString();

			return cloudinary.uploader.upload(
				path,
				{ public_id: `blog/${uniqueFilename}`, tags: `blog` },
				async (error, image) =>{
					if (err) return res.send(error);
					fs.unlinkSync(path);
					const user = await User.findByIdAndUpdate(
						'id',
						{ profile_picture: image.url },
						{ new: true },
					).exec();
					return res.json(user);
				},
			);
		});

  }

}


// const models = require("../../models/user");

// const { generateToken } = require("../helpers/jwt");
// const { successResponse, errorHelper } = require("../helpers/response");

// module.exports = {
//   async createUser(req, res, next) {
//     try {
//       const user = await models.create(req.body);
//       if (user) {
//         const token = await generateToken(user);
//         return successResponse(res, 201, {msg: 'Usercreated', token})
//       }
//       return errorHelper(res,400, {
//         error: "Could not create Profile"
//       });
//     } catch (error) {
//       return next(error.message)
//     }
//   }

// };

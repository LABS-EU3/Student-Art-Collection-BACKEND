const bcrypt = require('bcryptjs');

const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const multerUploads = require('multer');
const { merge } = require('lodash');



const { config, cloudinaryConfig, uploader } = require('../../config/cloudinaryConfig');

const User = require('../../models/user');

const models = require("../../models");

const secret = require('../../config/keys')




const storage = multerUploads.diskStorage({
	destination (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename (req, file, cb) {
		cb(null, file.originalname);
	},
});

const { generateToken, decodeToken } = require('../helpers/jwt');
const { successResponse, errorHelper } = require('../helpers/response');
const { sendEmailConfirmAccount } = require('../helpers/mail');

module.exports = {
  async createUser(req, res, next) {
    try {
      const user = await models.User.create(req.body);
      if (user) {
        const newUserType = {...req.body, userId: user.id}
        // this checks the user type and create that user type
        if (user.type === 'school')  {
          await models.School.create(newUserType)
        }else {
          await models.Buyer.create(newUserType)
        }
        const token = await generateToken(user);
         sendEmailConfirmAccount(user, token,`${secret.FRONTEND}/success`)
        return successResponse(res, 201, {msg: 'Usercreated', token})
      }
      return errorHelper(res,400, {
        error: "Could not create Profile"
      });
    } catch (error) {
      return next(error.message)
    }
  },

  async activateUser(req, res, next) {
    try {
      const user = await decodeToken(req.body.token);
      if(!user) {
        return errorHelper(res, 400, 'invalid token for user')
      }
      merge(user, {confirmed:true})
      user.save()
      return successResponse(res, 200, `${user.email} successfully confirmed`)
    } catch (error) {
      return next(error);
    }
  },
  async loginUser (req, res, next) {
    try{
    const user = await models.User.findOne({ email: req.body.email }).exec();

    if(!user || !user.comparePassword(req.body.password)) {
      return errorHelper(res, 401, 'Invalid credentials');
    }
    const token = await generateToken(user);
    if(!user.confirmed) {
       sendEmailConfirmAccount (user, token,`${secret.FRONTEND}/success`)
      return successResponse(res, 200, {message: 'please check your email address to confirm account'})
    }
    return successResponse(res, 200, {message: 'successfully logged in', token })
  } catch(error) {
	return next({ message: 'Error logging in user' });
  };
  },

  	photoUpload (req, res, next) {
		const {id} = req.params
		const upload = multerUploads({ storage }).single('name-of-input-key');
		upload(req, res, (err) => {
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
				async (error, image) => {
					if (err) return res.send(error);
					fs.unlinkSync(path);
					const user = await User.findByIdAndUpdate(
						id,
						{ profile_picture: image.url },
						{ new: true },
					).exec();
					return res.json(user);
				},
			);
		});
	},


};

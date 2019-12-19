const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const multerUploads = require('multer');
const { merge } = require('lodash');

const { generateToken, decodeToken } = require('../helpers/jwt');
const { successResponse, errorHelper } = require('../helpers/response');
const { sendEmailConfirmAccount } = require('../helpers/mail');


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

module.exports = {
  /**
   *
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns a message user created and a token
   */
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
      user.password = ''
    return successResponse(res, 200, {message: 'successfully logged in', token, user})
  } catch(error) {
	    return next({ message: 'Error logging in user' });
  };
  },

  photoUpload (req, res, next) {
    const {file, user} = req
    try {
      merge(user, {profile_picture:file.secure_url, public_id: file.public_id });
      user.save();
      return successResponse(res, 200, user)
    } catch (error) {
      return next(error.message)
    }
  }
};

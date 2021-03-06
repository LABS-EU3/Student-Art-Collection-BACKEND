
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { merge } = require("lodash");

const models = require("../../models");
const secret = require("../../config/keys");

const { generateToken, decodeToken } = require("../helpers/jwt");
const { successResponse, errorHelper } = require("../helpers/response");
const { sendEmailConfirmAccount } = require("../helpers/mail");
const mail = require("../helpers/ResetPassword");
const response = require("../helpers/response");
const { updateCompleteUserDetails, getCompleteUser } = require('../helpers/users');



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
        const newUserType = { ...req.body, userId: user.id };
        // this checks the user type and create that user type
        if (user.type === "school") {
          await models.School.create(newUserType);
        } else {
          await models.Buyer.create(newUserType);
        }
      
        const token = await generateToken(user);
        sendEmailConfirmAccount(user, token, `${secret.FRONTEND}/success`);
       
        return successResponse(res, 201, { msg: "Usercreated", token });
      }
      return errorHelper(res, 400, {
        error: "Could not create Profile"
      });
    } catch (error) {
      return next(error.message);
    }
  },

  async activateUser(req, res, next) {
    try {
      const user = await decodeToken(req.body.token);
      if (!user) {
        return errorHelper(res, 400, "invalid token for user");
      }
      merge(user, { confirmed: true });
      user.save();
      return successResponse(res, 200, `${user.email} successfully confirmed`);
    } catch (error) {
      return next(error);
    }
  },


  async sendPasswordMail(req, res, next) {
    const token = await crypto.randomBytes(20).toString("hex");
    const expiringDate = Date.now() + 3600000;
    try {
     mail.passwordResetMail(
        `${secret.FRONTEND}/resetpassword`,
        token,
        req.userEmail.email,
        req.userEmail.name
      );
     await models.User.findOneAndUpdate(
        { email: req.userEmail.email },
        {
          reset_password_token: token,
          reset_password_expires: expiringDate
        },
        { new: true }
      );
      return response.successResponse(
        res,
        200,
        `Email sent to ${req.userEmail.email}`
      );
    } catch (error) {
      return next({ message: "Error sending mail tryagain" });
    }
  },
  async resetPassword(req, res, next) {
    const { token } = req.query;
    try {
      const user = await models.User.findOne({
        reset_password_token: token
      }).exec();
      if (!user) {
        return response.errorHelper(
          res,
          401,
          "Invalid token to reset password"
        );
      }
      const savedDate = user.reset_password_expires
      const date = Date.now() - savedDate;
     
      if (date > 0) {
        return response.errorHelper(res, 400, "Password reset have expired");
      }
      const hash = await bcrypt.hash(req.body.password, 14);
     await models.User.findOneAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        { email: user.email },
        {
          password: hash,
          reset_password_token: ""
        }, {new: true}
      ).exec();
      return response.successResponse(res, 200, "Password reset was succesful");
    } catch (error) {
      return next({ message: error.message });
    }},
  async loginUser (req, res, next) {
    try{
    const user = await models.User.findOne({ email: req.body.email }).exec();

    if(!user) {
      return errorHelper(res, 401, 'Invalid credentials');
    }
    const confirm  = user.comparePassword(req.body.password)
    if(!confirm) {
      return errorHelper(res, 401, 'Invalid credentials');
    }
    const token = await generateToken(user);
    
    if(!user.confirmed) {
       sendEmailConfirmAccount (user, token,`${secret.FRONTEND}/success`)
       return successResponse(res, 200, {message: 'please check your email address to confirm account'})
      }
      user.password = '';
      const userDetails = await getCompleteUser(user, next, 'error getting user');
      return successResponse(res, 200, {
        message: 'successfully logged in', 
        token, 
        user: userDetails}
        );
  } catch(error) {
    return next({ message: 'Error logging in user' });
  }
  },
  async updateProfile(req, res, next) {
    try{
      const {user} = req;
      const {password} = req.body
      if(password) {
        req.body.password = bcrypt.hashSync(password, 10)
      }
      merge(user, req.body);
      user.save();
      const updatedUser =  await updateCompleteUserDetails(user, req,next,'unable to update user' )
      return successResponse(res, 200, updatedUser);
    } catch(error) {
      return next({ message: 'Error updating user profile'})
  };
  },

  async photoUpload (req, res, next) {
    const {file, user} = req
    try {
      merge(user, {profile_picture:file.secure_url, public_id: file.public_id });
      user.save();
      return successResponse(res, 200, user)
    } catch (error) {
      return next(error.message)

    }
  },

  async getAuser(req, res, next) {
    const { user } = req;
    const userDetails = await getCompleteUser(user, next, 'error getting user')
    return successResponse(res, 200, merge(user,userDetails));
  }
};

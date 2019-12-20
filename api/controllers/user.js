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
  async loginUser(req, res, next) {
    try {
      const user = await models.User.findOne({ email: req.body.email }).exec();

      if (!user || !user.comparePassword(req.body.password)) {
        return errorHelper(res, 401, "Invalid credentials");
      }
      const token = await generateToken(user);
      if (!user.confirmed) {
        sendEmailConfirmAccount(user, token, `${secret.FRONTEND}/success`);
        return successResponse(res, 200, {
          message: "please check your email address to confirm account"
        });
      }
      return successResponse(res, 200, {
        message: "successfully logged in",
        token
      });
    } catch (error) {
      return next({ message: "Error logging in user" });
    }
  },

  async sendPasswordMail(req, res, next) {
    const token = await crypto.randomBytes(20).toString("hex");
    const expiringDate = Date.now() + 3600;
    try {
      const sendMail = await mail.passwordResetMail(
        secret.frontEndUrl,
        token,
        req.userEmail.email,
        req.userEmail.name
      );
      if (!sendMail) {
        return response.error(res, 400, "Error sending mail try again");
      }
      await models.User.findOneAndUpdate(
        { email: req.userEmail.email },
        {
          reset_password_token: token,
          reset_password_expires: expiringDate
        },
        {
          new: true
        }
      );
      return response.success(res, 200, `Email sent to ${req.userEmail.email}`);
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
        return response.error(res, 401, "Invalid token to reset password");
      }
      const savedDate = user.dataValues.reset_password_expires;
      const date = Date.now() - savedDate;
      if (date > 0) {
        return response.error(res, 400, "Password reset have expired");
      }
      const hash = await bcrypt.hash(req.body.password, 14);
      const newUserPassword = await models.User.findOneAndUpdate( { id: user.dataValues.id },
        {
          password: hash,
          reset_password_token: ""
        },
        { new: true}
      );
      if (!newUserPassword) {
        return response.error(res, 404, "User not found");
      }
      return response.success(res, 200, "Password reset was succesful");
    } catch (error) {
      return next({ message: error.message });
    }
  }
};

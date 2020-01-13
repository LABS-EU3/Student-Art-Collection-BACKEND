
const contact = require("../helpers/ContactUs");
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

  sendContactMessage(req, res, next) {

    try {
      contact.sendContactMail(req.body);

      return response.successResponse(
        res,
        200,
        `Message sent! `
      );
    }
    catch (error) {
      return next({ message: "Error sending mail tryagain" });
    }
  }
};



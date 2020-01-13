
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
 
  async sendContactMessage(req, res, next) {

    try {
      const sendContactMail = await contact.sendContactMail(req.body);
      if (!sendContactMail) {
        return response.errorHelper(res, 400, "Error sending mail try again");
      }
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



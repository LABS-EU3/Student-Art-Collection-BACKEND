const Validator = require("validatorjs");
const { errorHelper } = require('../helpers/response');

module.exports = {
    validateContactForm(req, res, next) {
        const { body } = req;
        const validator = new Validator(body, {
            name: "required|min:2",
            email: "required|email",
            message: "required"
        });
        if (validator.fails()) {
            return errorHelper(res, 400, "Please ensure all fields are present.");
        }

        return next();

    }
}

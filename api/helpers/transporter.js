const nodemailer = require('nodemailer');
const secret = require('../../config/keys');
const { type, intro, instructions, button, outro, subject  } = require('./mailText')

function TransportMail() {
    let transporter;
    if(process.env.NODE_ENV === "test") {
        transporter = nodemailer.createTransport({
           host: 'smtp.gmail.com',
           port: 465,
           secure: true,
           requireTLS: true,
           auth: {
             type: type.FirstType,
             user: secret.USER_MAIL,
             pass: secret.PASSWORD_MAIL
           }
         });
        } else {
          transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                  user: secret.SENDGRID_USERNAME,
                  pass: secret.SENDGRID_PASSWORD
                }
              })
        }
        return transporter
}

module.exports = TransportMail
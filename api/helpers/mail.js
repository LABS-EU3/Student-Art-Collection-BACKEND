const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const secret = require('../../config/keys');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
      type: "login",
      user: secret.USER_MAIL,
      pass: secret.PASSWORD_MAIL
    }
  });
async function sendEmailConfirmAccount(user, token, url) {
  
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: 'ArtFinder',
          link: `${url}`,
        }
      });
      const mail = {
        body: {
          name: user.email,
          intro:
            'You have received this email because you just signup at ArtFinder',
          action: {
            instructions: 'Click the button below to confrim your account',
            button: {
              color: '#22BC66',
              text: 'Confirm your account',
              link: `${url}?token=${token}`
            }
          },
          outro:
            'If you did not signup to ArtFinder, no further action is required on your part.'
        }
      };
      const emailBody = mailGenerator.generate(mail);
    
      const emailText = mailGenerator.generatePlaintext(mail);
    
    const mailOption = {
        from: 'studentartcollectionlabseu3@gmail.com',
        to: user.email,
        subject: "Confirm your email",
        html: emailBody,
        text: emailText
      };

        const confirmMail = await transporter.sendMail(mailOption);
        return confirmMail;
}

module.exports = {sendEmailConfirmAccount}
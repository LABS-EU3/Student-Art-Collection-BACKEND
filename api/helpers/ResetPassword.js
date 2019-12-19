const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const secret = require('../../config/keys');



async function passwordResetMail(url, token, email, name) {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'ArtFinder',
      link: `${url}`,
    
    }
  });
  const mail = {
    body: {
      name,
      intro:
        'You have received this email because a password reset request for your account was received.',
      action: {
        instructions: 'Click the button below to reset your password:',
        button: {
          color: '#22BC66',
          text: 'Reset your password',
          link: `${url}?token=${token}`
        }
      },
      outro:
        'If you did not request a password reset, no further action is required on your part.'
    }
  };
  const emailBody = mailGenerator.generate(mail);

  const emailText = mailGenerator.generatePlaintext(mail);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    // requireTLS: true
    auth: {
      user: secret.USER_MAIL,
      pass: secret.PASSWORD_MAIL
    }
  });

  const mailOption = {
    from: 'studentartcollectionlabseu3@gmail.com',
    to: email,
    subject: 'Password Reset',
    html: emailBody,
    text: emailText
  };

  try {
    const passwordMail = await transporter.sendMail(mailOption);
    return passwordMail;
  } catch (error) {
    return error.message;
  }
}

module.exports = { passwordResetMail };
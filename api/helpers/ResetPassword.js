const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const secret = require('../../config/keys');
const { type, intro, instructions, button, outro, subject  } = require('./mailText')


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
        intro.second,
      action: {
        instructions: instructions.second,
        button: {
          color: button.color,
          text: button.text.second,
          link: `${url}?token=${token}`
        }
      },
      outro:
        outro.second
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
    subject: subject.second,
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
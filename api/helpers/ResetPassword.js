const Mailgen = require('mailgen');
const transporter = require('./transporter');
const {  intro, instructions, button, outro, subject  } = require('./mailText')


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

  const mailOption = {
    from: 'studentartcollectionlabseu3@gmail.com',
    to: email,
    subject: subject.second,
    html: emailBody,
    text: emailText
  };
    const passwordMail = await transporter().sendMail(mailOption);
    return passwordMail;
}

module.exports = { passwordResetMail };
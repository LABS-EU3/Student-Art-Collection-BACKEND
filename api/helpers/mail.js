
const Mailgen = require('mailgen');
const transporter = require('./transporter');
const { intro, instructions, button, outro, subject  } = require('./mailText')



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
           intro.first,
          action: {
            instructions: instructions.first,
            button: {
              color: button.color,
              text: button.text.first,
              link: `${url}?token=${token}`
            }
          },
          outro: outro.first,
            
        }
      };
      const emailBody = mailGenerator.generate(mail);
    
      const emailText = mailGenerator.generatePlaintext(mail);
    
    const mailOption = {
        from: 'studentartcollectionlabseu3@gmail.com',
        to: user.email,
        subject: subject.first,
        html: emailBody,
        text: emailText
      };
        try {
          const confirmMail = await transporter().sendMail(mailOption);
          return confirmMail;
        } catch (error) {
          return error.message
        }
}

module.exports = {sendEmailConfirmAccount}
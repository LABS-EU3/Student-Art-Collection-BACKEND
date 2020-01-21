const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const secret = require('../../config/keys');
const { type, intro, instructions, button, outro, subject  } = require('./mailText')

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

        const confirmMail = await transporter.sendMail(mailOption);
        return confirmMail;
}

module.exports = {sendEmailConfirmAccount}
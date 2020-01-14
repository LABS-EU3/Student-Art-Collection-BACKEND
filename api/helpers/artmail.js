const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const secret = require("../../config/keys");
const { intro,  outro, subject } = require("./mailText");

async function artMail(url, email, name, product) {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "ArtFinder",
      link: `${url}`
    }
  });
  const mail = {
    body: {
      name,
      intro: intro.third,
      table: {
        data: [
          {
            item: product.name,
            description: product.description,
            price: product.price
          }
        ],
        columns: {
          customWidth: {
            item: "20%",
            price: "15%"
          },

          customAlignment: {
            price: "right"
          }
        }
      },
     
      outro: outro.third
    }
  };
  const emailBody = mailGenerator.generate(mail);

  const emailText = mailGenerator.generatePlaintext(mail);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // requireTLS: true
    auth: {
      user: secret.USER_MAIL,
      pass: secret.PASSWORD_MAIL
    }
  });

  const mailOption = {
    from: "studentartcollectionlabseu3@gmail.com",
    to: email,
    subject: subject.Fourth,
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

module.exports = artMail ;

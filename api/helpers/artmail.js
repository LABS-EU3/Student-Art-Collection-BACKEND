const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const secret = require("../../config/keys");
const { intro, instructions, outro, subject } = require("./mailText");

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
      intro: "Your order has been processed successfully.",
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
     
      outro: "Thank You for your purchase"
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
    subject: "Art Delivery",
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

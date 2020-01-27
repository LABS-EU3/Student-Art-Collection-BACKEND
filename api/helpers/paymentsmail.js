const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const secret = require('../../config/keys');
const { intro, outro, subject } = require('./mailText');
const transporter = require('./transporter');

module.exports = {
  async artPurchaseConfirmationMailBuyer(url, email, name, product) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'ArtFinder',
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
              item: '20%',
              price: '15%'
            },

            customAlignment: {
              price: 'right'
            }
          }
        },

        outro: outro.third
      }
    };
    const emailBody = mailGenerator.generate(mail);
    console.log(email, '<< email of buyer');

    const emailText = mailGenerator.generatePlaintext(mail);
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   // requireTLS: true
    //   auth: {
    //     user: secret.USER_MAIL,
    //     pass: secret.PASSWORD_MAIL
    //   }
    // });

    // const mailOption = {
    //   from: 'studentartcollectionlabseu3@gmail.com',
    //   to: email,
    //   subject: subject.fourth,
    //   html: emailBody,
    //   text: emailText
    // };

    // try {
    //   const passwordMail = await transporter.sendMail(mailOption);
    //   return passwordMail;
    // } catch (error) {
    //   return error.message;
    // }
    const mailOption = {
      from: 'studentart-contactpage@art-funder.com',
      to: email,
      subject: subject.third,
      html: emailBody,
      text: emailText
    };
    const passwordMail = await transporter().sendMail(mailOption);
    return passwordMail;
  },
  async artPurchaseConfirmationMailSchool(
    url,
    schoolEmail,
    buyerEmail,
    name,
    product
  ) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'ArtFinder',
        link: `${url}`
      }
    });
    const mail = {
      body: {
        name,
        intro: intro.fifth,
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
              item: '20%',
              price: '15%'
            },

            customAlignment: {
              price: 'right'
            }
          }
        },

        outro: `${outro.fifth}: ${buyerEmail}.`
      }
    };
    const emailBody = mailGenerator.generate(mail);

    const emailText = mailGenerator.generatePlaintext(mail);
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   // requireTLS: true
    //   auth: {
    //     user: secret.USER_MAIL,
    //     pass: secret.PASSWORD_MAIL
    //   }
    // });

    // const mailOption = {
    //   from: 'studentartcollectionlabseu3@gmail.com',
    //   to: email,
    //   subject: subject.fourth,
    //   html: emailBody,
    //   text: emailText
    // };

    // try {
    //   const passwordMail = await transporter.sendMail(mailOption);
    //   return passwordMail;
    // } catch (error) {
    //   return error.message;
    // }
    const mailOption = {
      from: 'studentart-contactpage@art-funder.com',
      to: schoolEmail,
      subject: subject.sixth,
      html: emailBody,
      text: emailText
    };
    const passwordMail = await transporter().sendMail(mailOption);
    return passwordMail;
  },

  async artPurchaseFailureMail(url, email, name, product) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'ArtFinder',
        link: `${url}`
      }
    });
    const mail = {
      body: {
        name,
        intro: intro.fourth,
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
              item: '20%',
              price: '15%'
            },

            customAlignment: {
              price: 'right'
            }
          }
        },

        outro: outro.fourth
      }
    };
    const emailBody = mailGenerator.generate(mail);

    const emailText = mailGenerator.generatePlaintext(mail);
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   // requireTLS: true
    //   auth: {
    //     user: secret.USER_MAIL,
    //     pass: secret.PASSWORD_MAIL
    //   }
    // });

    // const mailOption = {
    //   from: 'studentartcollectionlabseu3@gmail.com',
    //   to: email,
    //   subject: subject.fifth,
    //   html: emailBody,
    //   text: emailText
    // };

    // try {
    //   const passwordMail = await transporter.sendMail(mailOption);
    //   return passwordMail;
    // } catch (error) {
    //   return error.message;
    // }
    const mailOption = {
      from: 'studentart-contactpage@art-funder.com',
      to: email,
      subject: subject.third,
      html: emailBody,
      text: emailText
    };
    const passwordMail = await transporter().sendMail(mailOption);
    return passwordMail;
  }
};

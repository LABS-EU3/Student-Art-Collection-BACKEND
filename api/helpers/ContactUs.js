const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const secret = require('../../config/keys');
const { subject } = require('./mailText')



async function sendContactMail({ name, email, message }) {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'ArtFinder',
            link: `http:localhost:3000/test`,
        }
    });
    const mail = {
        body: {
            name: "ArtFunder Customer Services",
            intro: `Message from ${name},  Email address: ${email}`,
            outro: `Query: ${message}`
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
        from: secret.USER_MAIL,
        to: secret.USER_MAIL,
        subject: subject.third,
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

module.exports = { sendContactMail };
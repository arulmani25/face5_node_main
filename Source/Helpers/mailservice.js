const nodemailer = require('nodemailer');

const smtpMailId = process.env.SMTP_MAIL_ID;
const smtpMailPass = process.env.SMTP_PASSWORD;
//! use bookmysuites credentials

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: smtpMailId,
        pass: smtpMailPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMailNotification = async (toAddress, subject, text) => {
    transporter.sendMail(
        {
            from: smtpMailId,
            to: `${toAddress}`,
            subject: `${subject}`,
            html: `${text}`
        },
        function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(info.response, 'mail sent');
            }
        }
    );
};

module.exports = { sendMailNotification };

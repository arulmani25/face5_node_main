let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');
let path = require('path');

const SMTPTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tomacinfotech@gmail.com',
        pass: 'Mohammed23952'
    }
});

const hbsOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: __dirname + '/' + '/views/email/partials',
        layoutsDir: __dirname + '/' + '/views/email',
        defaultLayout: 'layout.hbs'
    },
    viewPath: __dirname + '/' + '/views/email',
    extName: '.hbs'
};

SMTPTransport.use('compile', hbs(hbsOptions));

module.exports.sendEmail = (to, subject, template, data) => {
    const from = 'API-DOC-PRO <tomacinfotech@gmail.com>';
    console.log('please check the ', data);
    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        template: template + '.email',
        context: data
    };
    try {
        SMTPTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                console.log('email path....', mailOptions);
                return true;
            }
            console.log('email is send');
            console.log(info);
            //res.json(info)
            return true;
        });
    } catch (e) {
        console.log(e);
        return false;
    }

    return true;
};

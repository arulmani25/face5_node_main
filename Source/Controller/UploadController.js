const express = require('express');
const Router = express.Router();
const moment = require('moment');
const bodyParser = require('body-parser');
const { VerifyToken } = require('../Helpers/JWSToken');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());

Router.post('/upload', VerifyToken, async (req, res) => {
    const payload = req.files;
    if (Object.keys(payload.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const sampleFile = payload.files;
    const filePath = [];
    if (sampleFile.length > 1) {
        sampleFile.forEach((element) => {
            const time_details = moment().format('YYYYMMDDHHmmss');
            var path = 'upload/' + time_details + '_' + element.name;
            element.mv(path, async function (err) {
                if (err) return err;
            });
            filePath.push(path);
        });
    } else {
        const time_details = moment().format('YYYYMMDDHHmmss');
        var path = 'upload/' + time_details + '_' + req.body.title + '.' + sampleFile.name.split('.').at(1);
        sampleFile.mv(path, async function (err) {
            if (err) return err;
        });
        filePath.push(path);
    }
    return res.status(200).json({
        Status: 'Success',
        Message: 'Upload success',
        Data: filePath,
        Code: 200
    });
});

module.exports = Router;

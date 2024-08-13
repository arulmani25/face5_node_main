const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { runCron } = require('./CronHelper/cron');

const dotenv = require('dotenv');
const environment = process.env.NODE_ENV || 'production';
const envPath = path.resolve(__dirname, `.env.${environment}`);
dotenv.config({ path: envPath });
const baseURL = process.env.BASE_URL;
const apiURL = `${baseURL}/api`;
console.log('====__dirname', __dirname);
console.log('====envPath', envPath);
console.log('===baseURL', baseURL);
console.log('===apiURL', apiURL);

// Operation Module
const responseMiddleware = require('./middlewares/response.middleware');
const app = express();

app.use(fileUpload());
app.use(responseMiddleware());

require('./Models/MultiConnection').establish(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'pug');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/*Response settings*/

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
    );
    next();
});

app.post('/upload', function (req, res) {
    var sampleFile;
    var uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.json({
            Status: 'Failed',
            Message: 'No File Found',
            Data: {},
            Code: 404
        });
        return;
    } else {
        var temp_data;
        sampleFile = req.files.sampleFile;
        var exten = sampleFile.name.split('.');
        var filetype = exten[exten.length - 1];
        var name = '' + new Date().getTime() + '.' + filetype;
        uploadPath = __dirname + '/public/uploads/' + name;
        var Finalpath = apiURL + '/uploads/' + name;
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                return res.error(500, 'Internal server error');
            }
            res.json({
                Status: 'Success',
                Message: 'file upload success',
                Data: Finalpath,
                Code: 200
            });
        });
    }
});

app.post('/upload2', function (req, res) {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.json({
            Status: 'Failed',
            Message: 'No File Found',
            Data: {},
            Code: 404
        });
        return;
    } else {
        var temp_data;
        sampleFile = req.files.sampleFile;
        var exten = sampleFile.name.split('.');
        var filetype = exten[exten.length - 1];
        var name = '' + new Date().getTime() + '.' + filetype;
        console.log('===__dirname', __dirname);
        uploadPath = __dirname + '/public/uploads/' + name;
        console.log('===uploadPath', uploadPath);
        var Finalpath = apiURL + '/uploads/' + name;
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                return res.error(500, 'Internal server error');
            }
            res.json({
                Status: 'Success',
                Message: 'file upload success',
                Data: Finalpath,
                Code: 200
            });
        });
    }
});

app.post('/service_visiblity_upload', function (req, res) {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.json({
            Status: 'Failed',
            Message: 'No File Found',
            Data: {},
            Code: 404
        });
        return;
    } else {
        var temp_data;
        sampleFile = req.files.sampleFile;
        var exten = sampleFile.name.split('.');
        var filetype = exten[exten.length - 1];
        const dates = require('date-and-time');
        const now1 = new Date(req.body.program_date);
        const value1 = dates.format(now1, 'YYYYMMDD');
        var name =
            '' + req.body.cat_type + '_' + req.body.job_id + '_' + value1 + '_' + new Date().getTime() + '.' + filetype;
        console.log('File Name', name);
        uploadPath = __dirname + '/public/SERVPRO' + new Date().getFullYear() + '/' + name;
        var Finalpath = apiURL + '/SERVPRO' + new Date().getFullYear() + '/' + name;
        console.log('uploaded path', uploadPath);
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                return res.error(500, 'Internal server error');
            }
            res.json({
                Status: 'Success',
                Message: 'file upload success',
                Data: Finalpath,
                Code: 200
            });
        });
    }
});

// For All File Upload 28-07-2023
app.post('/fileUploadAll', function (req, res) {
    console.log('=====fileUploadAll=======req.body', req.body, req.files);
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('====nofile=========================================');
        res.json({
            Status: 'Failed',
            Message: 'No File Found',
            Data: {},
            Code: 404
        });
        return;
    } else {
        var temp_data;
        sampleFile = req.files.sampleFile;
        var exten = sampleFile.name.split('.');
        var filetype = exten[exten.length - 1];
        console.log('====innnnnnnnnnnnnnnn=========================================');
        var name = req.body.serv_type + '_' + req.body.job_id + '_' + new Date().getTime() + '.' + filetype;
        console.log('File Name', name);
        uploadPath = __dirname + '/public/CVRPHOTOS/' + req.body.serv_type + '/' + name;
        var Finalpath = apiURL + '/CVRPHOTOS/' + req.body.serv_type + '/' + name;
        console.log('uploaded path==========================', uploadPath);
        console.log('Finalpath path==========================', Finalpath);
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                console.log('err==========================', err);
                return res.error(500, 'Internal server error');
            }
            res.json({
                Status: 'Success',
                Message: 'file upload success',
                Data: Finalpath,
                Code: 200
            });
        });
    }
});

app.post('/failure_report_upload', function (req, res) {
    console.log(req.body);
    console.log('===============failure_report_upload', req.body);
    console.log('===============failure_report_upload', req.files);
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.json({
            Status: 'Failed',
            Message: 'No File Found',
            Data: {},
            Code: 404
        });
        return;
    } else {
        var temp_data;
        sampleFile = req.files.sampleFile;
        var exten = sampleFile.name.split('.');
        var filetype = exten[exten.length - 1];
        fs.exists(path.join(__dirname + '/public/CVRPHOTOS', req.body.seq_no), (exists) => {
            console.log('==========failure_report_uploadexistsss=======', exists);
            if (exists == true) {
                var name = 'FR' + '_' + req.body.job_id + '_' + new Date().getTime() + '.' + filetype;
                console.log('File Name', name);
                uploadPath = __dirname + '/public/CVRPHOTOS/' + req.body.seq_no + '/' + name;
                var Finalpath = apiURL + '/CVRPHOTOS/' + req.body.seq_no + '/' + name;
                console.log('uploaded path', uploadPath);
                sampleFile.mv(uploadPath, function (err) {
                    if (err) {
                        console.log(err);
                        return res.error(500, 'Internal server error');
                    }
                    res.json({
                        Status: 'Success',
                        Message: 'file upload success',
                        Data: Finalpath,
                        Code: 200
                    });
                });
            } else {
                fs.mkdirSync(path.join(__dirname + '/public/CVRPHOTOS', req.body.seq_no), true);
                var name = 'FR' + '_' + req.body.job_id + '_' + new Date().getTime() + '.' + filetype;
                console.log('File Name', name);
                uploadPath = __dirname + '/public/CVRPHOTOS/' + req.body.seq_no + '/' + name;
                var Finalpath = apiURL + '/CVRPHOTOS/' + req.body.seq_no + '/' + name;
                console.log('uploaded path', uploadPath);
                sampleFile.mv(uploadPath, function (err) {
                    if (err) {
                        console.log(err);
                        return res.error(500, 'Internal server error');
                    }
                    res.json({
                        Status: 'Success',
                        Message: 'file upload success',
                        Data: Finalpath,
                        Code: 200
                    });
                });
            }
        });
    }
});

app.post('/serviceSales/fileUpload', async (req, res) => {
    try {
        var sampleFile = req.files.sampleFile;
        if (!sampleFile) {
            return res.json({
                Status: 'Failed',
                Message: 'No File Found',
                Data: {},
                Code: 404
            });
        }
        var exten = sampleFile.name.split('.');
        var filetype = exten[exten.length - 1];
        var name = `${new Date().getTime()}.${filetype}`;

        var uploadPath = path.join(__dirname, '/public/SERVICE_SALES/', name);
        var Finalpath = `${apiURL}/SERVICE_SALES/${name}`;

        await sampleFile.mv(uploadPath);

        res.json({
            Status: 'Success',
            Message: 'File upload success',
            Data: Finalpath,
            Code: 200
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/', express.static(path.join(__dirname)));
app.use('/api/', express.static(path.join(__dirname, 'public')));
app.use('/api/', express.static(path.join(__dirname, 'routes')));
app.use('/api/', express.static(path.join(__dirname, 'Gad_Drawing')));
app.use('/api/', express.static(path.join(__dirname, 'assets')));

// Face5 routes Start
app.use('/api/face5', require('./Routes/Routes'));
app.use('/api/face5', require('./Routes/ActivityRoutes'));

//cron to shedule jobs
runCron();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).end('Page Not Found');
});

module.exports = app;

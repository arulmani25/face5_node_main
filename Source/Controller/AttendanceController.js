const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const moment = require('moment');
const { VerifyToken } = require('../Helpers/JWSToken');

const Attendance = require('../Models/AttendanceModel');

// Create a new activity
Router.post('/create', async (req, res) => {
    try {
        if (!req.body.userPhoneNumber || !req.body.location || !req.body.lat || !req.body.lan) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'mobile number, location,lat and lan are required fields',
                Data: {},
                Code: 400
            });
        }

        const record = await Attendance.create(req.body);

        return res.status(200).json({
            Status: 'Success',
            Message: 'Attendance submitted successfully',
            Data: record,
            Code: 200
        });
    } catch (error) {
        console.log('=====error', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

// Get all activities
Router.get('/getlaststatus', VerifyToken, async (req, res) => {
    try {
        const startDate = moment();
        const attendanceList = await Attendance.find({
            userPhoneNumber: req.query.userPhoneNumber,
            createdAt: {
                $gte: new Date(startDate.startOf('days')),
                $lte: new Date(startDate.endOf('days'))
            }
        });
        const data = attendanceList.length ? attendanceList.at(-1) : [];
        return res.status(200).json({
            Status: 'Success',
            Message: 'record retrieved successfully',
            Data: data,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.post('/list', VerifyToken, async (req, res) => {
    try {
        const startDate = moment(req.body.fromDate);
        const endDate = moment(req.body.toDate);

        const data = await Attendance.aggregate([
            {
                $match:
                    req.body.userPhoneNumber && req.body.fromDate && req.body.toDate
                        ? {
                              userPhoneNumber: req.body.userPhoneNumber,
                              createdAt: {
                                  $gte: new Date(startDate.startOf('days')),
                                  $lte: new Date(endDate.endOf('days'))
                              }
                          }
                        : {
                              createdAt: {
                                  $gte: new Date(startDate.startOf('days')),
                                  $lte: new Date(endDate.endOf('days'))
                              }
                          }
            },
            {
                $addFields: {
                    date: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    }
                }
            },
            {
                $sort: { createdAt: 1 }
            },
            {
                $group: {
                    _id: {
                        date: '$date',
                        userPhoneNumber: '$userPhoneNumber'
                    },
                    firstRecord: { $first: '$$ROOT' },
                    lastRecord: { $last: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id.date',
                    userPhoneNumber: '$_id.userPhoneNumber',
                    firstRecord: 1,
                    lastRecord: 1
                }
            }
        ]);

        const finalRecord = [];
        data.forEach((iterator) => {
            finalRecord.push({
                date: iterator.date,
                userName: iterator.firstRecord.userName,
                userPhoneNumber: iterator.firstRecord.userPhoneNumber,
                checkInTime: iterator.firstRecord.checkInTime ? iterator.firstRecord.createdAt : '',
                checkOutTime: iterator.lastRecord.checkOutTime ? iterator.lastRecord.createdAt : '',
                checkInlocation: iterator.firstRecord.checkInTime ? iterator.firstRecord.location : '',
                checkOutlocation: iterator.lastRecord.checkOutTime ? iterator.lastRecord.location : ''
            });
        });

        return res.status(200).json({
            Status: 'Success',
            Message: 'Attendance retrieved successfully',
            Data: finalRecord,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.post('/emplist', VerifyToken, async (req, res) => {
    try {
        const startDate = moment(req.body.fromDate);
        const endDate = moment(req.body.toDate);

        const activity = await Attendance.aggregate([
            {
                $match:
                    req.body.userPhoneNumber && req.body.fromDate && req.body.toDate
                        ? {
                              userPhoneNumber: req.body.userPhoneNumber,
                              createdAt: {
                                  $gte: new Date(startDate.startOf('days')),
                                  $lte: new Date(endDate.endOf('days'))
                              }
                          }
                        : {
                              createdAt: {
                                  $gte: new Date(startDate.startOf('days')),
                                  $lte: new Date(endDate.endOf('days'))
                              }
                          }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        return res.status(200).json({
            Status: 'Success',
            Message: 'Attendance retrieved successfully',
            Data: activity,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

module.exports = Router;

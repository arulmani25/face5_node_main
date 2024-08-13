const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const subAdminAccessModel = require('../Models/SubAdminAccessModel');
const { VerifyToken } = require('../Helpers/JWSToken');

Router.post('/create', VerifyToken, async function (req, res) {
    const isExist = await subAdminAccessModel.findOne({
        user_name: req.body.user_name
    });
    if (isExist == null) {
        try {
            await subAdminAccessModel.create(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    status: req.body.status,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    username: req.body.username,
                    password: req.body.password,
                    confirm_password: req.body.confirm_password,
                    access_location: req.body.access_location,
                    isActive: req.body.isActive,
                    last_login: new Date()
                },
                function (err, user) {
                    res.json({
                        Status: 'Success',
                        Message: 'Sub Admin Access Added successfully',
                        Data: user,
                        Code: 200
                    });
                }
            );
        } catch (e) {
            res.json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    } else {
        res.json({
            Status: 'Access Already Created',
            Message: 'Access Already Created',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/deletes', VerifyToken, function (req, res) {
    subAdminAccessModel.remove({}, function (err, user) {
        if (err) return res.status(500).send('There was a problem deleting the sub admin access.');
        res.json({
            Status: 'Success',
            Message: 'subAdminAccess Deleted',
            Data: {},
            Code: 200
        });
    });
});

Router.post('/getdetailById', VerifyToken, function (req, res) {
    subAdminAccessModel.findOne({ _id: req.body._id }, function (err, StateList) {
        res.json({
            Status: 'Success',
            Message: 'State List',
            Data: StateList,
            Code: 200
        });
    });
});

Router.post('/subadmin/login', function (req, res) {
    subAdminAccessModel.findOne({ username: req.body.username, password: req.body.password }, function (err, data) {
        if (data !== null) {
            res.json({
                Status: 'Success',
                Message: 'Sub Admin Logged In Successfully',
                Data: data,
                Code: 200
            });
        } else {
            res.json({
                Status: 'Failed',
                Message: 'Account Not Found',
                Data: {},
                Code: 200
            });
        }
    });
});

//list sub admin access

Router.get('/getlist', VerifyToken, function (req, res) {
    subAdminAccessModel.find({}, function (err, data) {
        res.json({
            Status: 'Success',
            Message: 'List Retrived SuccessFully',
            Data: data,
            Code: 200
        });
    });
});

// ******************************************************************************************************************************************************************************
//  SUB-ADMIN EDIT
// ******************************************************************************************************************************************************************************
Router.post('/edit', VerifyToken, function (req, res) {
    subAdminAccessModel.findByIdAndUpdate(req.body._id, req.body, { new: true }, function (err, UpdatedDetails) {
        if (err)
            return res.json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        res.json({
            Status: 'Success',
            Message: 'Record Updated Successfully',
            Data: UpdatedDetails,
            Code: 200
        });
    });
});

// ******************************************************************************************************************************************************************************
//  SUB-ADMIN DELETE
// ******************************************************************************************************************************************************************************
Router.post('/delete', VerifyToken, function (req, res) {
    subAdminAccessModel.findByIdAndRemove(req.body._id, function (err, user) {
        if (err)
            return res.json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        res.json({
            Status: 'Success',
            Message: 'SubAdmin Deleted successfully',
            Data: {},
            Code: 200
        });
    });
});

module.exports = Router;

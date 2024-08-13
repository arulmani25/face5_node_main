const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const User = require('../Models/UserModel');
const UserType = require('../Models/UserTypeModel');
const { VerifyToken } = require('../Helpers/JWSToken');

Router.post('/createUserType', VerifyToken, async (req, res) => {
    try {
        if (!req.body.name || !req.body.code) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Name and code are required fields',
                Data: {},
                Code: 400
            });
        }

        const existingType = await UserType.findOne({ code: req.body.code });
        if (existingType) {
            return res.status(409).json({
                Status: 'Failed',
                Message: 'User type code already exists',
                Data: {},
                Code: 409
            });
        }

        const newUserType = await UserType.create(req.body);
        return res.status(200).json({
            Status: 'Success',
            Message: 'User type created successfully',
            Data: newUserType,
            Code: 200
        });
    } catch (error) {
        console.error('Error creating user type:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/getUserType', VerifyToken, async (req, res) => {
    try {
        const userTypes = await UserType.find();
        return res.status(200).json({
            Status: 'Success',
            Message: 'User types retrieved successfully',
            Data: userTypes,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching user types:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/userType/:id', VerifyToken, async (req, res) => {
    try {
        const userType = await UserType.findById(req.params.id);
        if (!userType) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User type not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'User type retrieved successfully',
            Data: userType,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching user type:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.put('/updateUserType/:id', VerifyToken, async (req, res) => {
    try {
        const updatedUserType = await UserType.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Return updated document
        if (!updatedUserType) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User type not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'User type updated successfully',
            Data: updatedUserType,
            Code: 200
        });
    } catch (error) {
        console.error('Error updating user type:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.delete('/userType/:id', VerifyToken, async (req, res) => {
    try {
        const deletedUserType = await UserType.findByIdAndDelete(req.params.id);
        if (!deletedUserType) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'User type not found',
                Data: {},
                Code: 404
            });
        }
        // Check for dependent users before deletion (optional)
        const hasUsers = await User.find({ userType: deletedUserType._id });
        if (hasUsers.length > 0) {
            return res.status(409).json({
                Status: 'Failed',
                Message: 'User type cannot be deleted as users are assigned to it',
                Data: {},
                Code: 409
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'User type deleted successfully',
            Data: deletedUserType,
            Code: 200
        });
    } catch (error) {
        console.error('Error deleting user type:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

module.exports = Router;

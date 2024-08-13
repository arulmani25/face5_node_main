const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');

const UserTypeLocal = '../Models/UserTypeModel';
const UserType = require(UserTypeLocal);
const { VerifyToken } = require('../Helpers/JWSToken');
const AccessConfigLocal = '../Models/AccessConfigModel';
const AccessConfig = require(AccessConfigLocal);

Router.post('/create', async (req, res) => {
    try {
        const existingAccess = await AccessConfig.findOne({
            role: new mongoose.Types.ObjectId(req.body.role)
        });
        if (existingAccess) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Role Configuration already exists',
                Data: {},
                Code: 400
            });
        }

        const newAccess = await AccessConfig.create(req.body);
        const getRole = await UserType.findById(req.body.role);
        return res.status(200).json({
            Status: 'Success',
            Message: `Acces configuration for the role ${getRole.name} created successfully`,
            Data: newAccess,
            Code: 200
        });
    } catch (error) {
        console.error('Error creating access:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/listbyrole', VerifyToken, async (req, res) => {
    try {
        const getIdByRole = await UserType.findOne({
            name: req.loggedUser.user_type
        });
        const getConfigs = await AccessConfig.findOne({
            role: new mongoose.Types.ObjectId(getIdByRole._id)
        });

        return res.status(200).json({
            Status: 'Success',
            Message: 'Access Configuration Retrieved Successfully',
            Data: getConfigs,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching Access:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/list', async (req, res) => {
    try {
        const getConfigs = await AccessConfig.find({});

        return res.status(200).json({
            Status: 'Success',
            Message: 'Access Configuration Retrieved Successfully',
            Data: getConfigs,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching Access:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const accessConfig = await AccessConfig.findById(req.params.id);
        if (!accessConfig) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Access config not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'Access Configuration retrieved successfully',
            Data: accessConfig,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching Access Config:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.put('/:id', async (req, res) => {
    try {
        const updatedAccess = await AccessConfig.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Return updated document
        if (!updatedAccess) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Access Config not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'Access Configuration updated successfully',
            Data: updatedAccess,
            Code: 200
        });
    } catch (error) {
        console.error('Error updating Access config:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.delete('/:id', async (req, res) => {
    try {
        const deletedConfig = await AccessConfig.findByIdAndDelete(req.params.id);
        if (!deletedConfig) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Access Configuration not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'Access Configuration deleted successfully',
            Data: deletedConfig,
            Code: 200
        });
    } catch (error) {
        console.error('Error deleting Access config:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

module.exports = Router;

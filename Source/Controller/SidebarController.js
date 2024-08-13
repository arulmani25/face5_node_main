const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');

const SidebarItem = require('../Models/SidebarModel');
const { VerifyToken } = require('../Helpers/JWSToken');
const AccessConfigLocal = '../Models/AccessConfigModel';
const AccessConfig = require(AccessConfigLocal);
const UserType = require('../Models/UserTypeModel');

// Create a new sidebar item
Router.post('/sidebar-items', VerifyToken, async (req, res) => {
    try {
        const newSidebarItem = await SidebarItem.create(req.body);
        res.status(201).json({
            Status: 'Success',
            Message: 'Sidebar item created successfully',
            Data: newSidebarItem,
            Code: 201
        });
    } catch (error) {
        console.log('=======error', error);
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

// Get all sidebar items
Router.get('/listbyrole', VerifyToken, async (req, res) => {
    try {
        const getIdByRole = await UserType.findOne({
            name: req.loggedUser.user_type
        });
        const getConfigs = await AccessConfig.findOne({
            role: new mongoose.Types.ObjectId(getIdByRole._id)
        });

        const sideBarItems = [];

        for (const iterator of getConfigs.sideBar) {
            if (iterator.read) {
                sideBarItems.push(iterator.title);
            }
        }
        const sidebarItems = await SidebarItem.find({
            title: { $in: sideBarItems }
        });
        res.json({
            Status: 'Success',
            Message: 'Sidebar items fetched successfully',
            Data: sidebarItems,
            Code: 200
        });
    } catch (error) {
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

// Get sidebar list
Router.get('/sidebar-items', VerifyToken, async (req, res) => {
    try {
        const sidebarItem = await SidebarItem.find();
        if (!sidebarItem) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Sidebar item not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Sidebar item fetched successfully',
            Data: sidebarItem,
            Code: 200
        });
    } catch (error) {
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

// Get sidebar item by ID
Router.get('/sidebar-items/:id', VerifyToken, async (req, res) => {
    try {
        const sidebarItem = await SidebarItem.findById(req.params.id);
        if (!sidebarItem) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Sidebar item not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Sidebar item fetched successfully',
            Data: sidebarItem,
            Code: 200
        });
    } catch (error) {
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

// Update sidebar item by ID
Router.put('/sidebar-items/:id', VerifyToken, async (req, res) => {
    try {
        const updatedSidebarItem = await SidebarItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSidebarItem) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Sidebar item not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Sidebar item updated successfully',
            Data: updatedSidebarItem,
            Code: 200
        });
    } catch (error) {
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

// Delete sidebar item by ID
Router.delete('/sidebar-items/:id', VerifyToken, async (req, res) => {
    try {
        const deletedSidebarItem = await SidebarItem.findByIdAndDelete(req.params.id);
        if (!deletedSidebarItem) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Sidebar item not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Sidebar item deleted successfully',
            Data: deletedSidebarItem,
            Code: 200
        });
    } catch (error) {
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

module.exports = Router;

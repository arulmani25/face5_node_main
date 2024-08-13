const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');

const Activity = require('../Models/ActivityModel');
const SidebarItem = require('../Models/SidebarModel');
const Subactivity = require('../Models/SubactivityModel');
const CheckListModel = require('../Models/ChecklistModel');
const { VerifyToken } = require('../Helpers/JWSToken');
const ObjectId = mongoose.Types.ObjectId;

// Create a new subactivity

Router.post('/createSubActivity', VerifyToken, async (req, res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.parentActivity) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Title, description, and parentActivity are required fields',
                Data: {},
                Code: 400
            });
        }
        console.log('======req.body', req.body);
        const activityData = await Activity.findOne({
            _id: req.body.parentActivity
        });
        if (!activityData) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Parent activity not exists',
                Data: {},
                Code: 400
            });
        }

        // check checklist exist under the main-activity

        const isExist = await CheckListModel.findOne({
            main_activity_id: new ObjectId(activityData._id)
        });
        if (isExist) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Delete Activity Checklist To Create Sub-Activity',
                Data: {},
                Code: 400
            });
        }
        const newSubactivity = await Subactivity.create(req.body);
        console.log('=======newSubactivity', newSubactivity);
        const parentActivitySidebarItem = await SidebarItem.findOne({
            link: `/activities/${req.body.parentActivity}`
        });

        if (!parentActivitySidebarItem) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Parent activity sidebar item not found',
                Data: {},
                Code: 404
            });
        }
        console.log('======parentActivitySidebarItem', parentActivitySidebarItem);
        parentActivitySidebarItem.subItems.push({
            title: newSubactivity.title,
            icon: 'icon',
            link: `/subactivities/${newSubactivity._id}`
        });
        return res.status(201).json({
            Status: 'Status',
            Message: 'Sub Activity Created Successfully',
            Data: {},
            Code: 201
        });
    } catch (error) {
        console.log('========error', error);
        res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.post('/updateSubactivities', VerifyToken, async (req, res) => {
    try {
        // Basic input validation
        if (!req.body.title || !req.body.description || !req.body.parentActivity) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Title, description, and parentActivity are required fields',
                Data: {},
                Code: 400
            });
        }
        const updatedSubactivity = await Subactivity.findByIdAndUpdate(req.body.id, req.body, { new: true });
        if (!updatedSubactivity) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Subactivity not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Subactivity updated successfully',
            Data: updatedSubactivity,
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

Router.get('/subactivities', VerifyToken, async (req, res) => {
    try {
        const subactivities = await Subactivity.aggregate([
            {
                $lookup: {
                    from: 'activities',
                    localField: 'parentActivity',
                    foreignField: '_id',
                    as: 'result'
                }
            },
            {
                $unwind: {
                    path: '$result',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    parentActivity: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    code: 1,
                    parentActivityTitle: '$result.title'
                }
            }
        ]);
        res.json({
            Status: 'Success',
            Message: 'Subactivities fetched successfully',
            Data: subactivities,
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

Router.get('/subactivities/:id', VerifyToken, async (req, res) => {
    try {
        const subactivity = await Subactivity.findById(req.params.id);
        if (!subactivity) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Subactivity not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Subactivity fetched successfully',
            Data: subactivity,
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

// Delete subactivity by ID
Router.delete('/subactivities/:id', VerifyToken, async (req, res) => {
    try {
        const deletedSubactivity = await Subactivity.findByIdAndDelete(req.params.id);
        if (!deletedSubactivity) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Subactivity not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Subactivity deleted successfully',
            Data: deletedSubactivity,
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

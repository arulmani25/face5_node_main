const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const mongoose = require('mongoose');
const { VerifyToken } = require('../Helpers/JWSToken');
const ObjectId = mongoose.Types.ObjectId;
const Activity = require('../Models/ActivityModel');
const SidebarItem = require('../Models/SidebarModel');
const CheckListModel = require('../Models/ChecklistModel');

// Create a new activity
router.post('/createActivity', VerifyToken, async (req, res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.index) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Title, description, and index are required fields',
                Data: {},
                Code: 400
            });
        }
        const existingActivity = await Activity.findOne({ index: req.body.index });
        if (existingActivity) {
            return res.status(409).json({
                Status: 'Failed',
                Message: 'Duplicate index found. Please choose a unique index.',
                Data: {},
                Code: 409
            });
        }
        const newActivity = await Activity.create(req.body);
        const sidebarItem = new SidebarItem({
            title: req.body.title,
            icon: 'icon',
            link: `/activities/${newActivity._id}`,
            order: req.body.index
        });
        await sidebarItem.save();
        return res.status(200).json({
            Status: 'Success',
            Message: 'Activity created successfully',
            Data: newActivity,
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
router.get('/activities', VerifyToken, async (req, res) => {
    try {
        //const activities = await Activity.find().populate('Subactivity');
        const activities = await Activity.find();
        return res.status(200).json({
            Status: 'Success',
            Message: 'Activities retrieved successfully',
            Data: activities,
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

router.get('/activities/:id', VerifyToken, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Activity not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'Activity retrieved successfully',
            Data: activity,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching activity:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

// Update an activity by its ID
router.post('/updateActivities', VerifyToken, async (req, res) => {
    try {
        // Basic input validation
        if (!req.body.title || !req.body.description || !req.body.index) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'Title, description, and index are required fields',
                Data: {},
                Code: 400
            });
        }

        const activity = await Activity.findByIdAndUpdate(req.body.id, req.body, {
            new: true
        });
        if (!activity) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Activity not found',
                Data: {},
                Code: 404
            });
        }
        return res.json({
            Status: 'Success',
            Message: 'Activity updated successfully',
            Data: activity,
            Code: 200
        });
    } catch (error) {
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

router.delete('/activities/:id', VerifyToken, async (req, res) => {
    try {
        const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
        if (!deletedActivity) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Activity not found',
                Data: {},
                Code: 404
            });
        }
        //remove checklists maped with activity
        await CheckListModel.deleteMany({
            main_activity_id: new ObjectId(req.params.id)
        });

        res.json({
            Status: 'Success',
            Message: 'Activity deleted successfully',
            Data: deletedActivity,
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

//mobile routes

router.get('/mobile/activities', VerifyToken, async (req, res) => {
    try {
        //const activities = await Activity.find().populate('Subactivity');
        const activities = await Activity.aggregate([
            {
                $lookup: {
                    from: 'subactivities',
                    localField: '_id',
                    foreignField: 'parentActivity',
                    as: 'subactivity'
                }
            }
        ]);
        return res.status(200).json({
            Status: 'Success',
            Message: 'Activities retrieved successfully',
            Data: activities,
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

module.exports = router;

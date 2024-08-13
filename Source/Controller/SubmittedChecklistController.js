const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const SubmittedChecklistModel = require('../Models/SubmitChecklistModel');
const { VerifyToken } = require('../Helpers/JWSToken');
const jobManagementModel = require('../Models/JobManagementModel');
const { jobStatus } = require('../Helpers');

Router.post('/submit', VerifyToken, async (req, res) => {
    try {
        const existingJob = await SubmittedChecklistModel.findOne({
            job_id: new ObjectId(req.body.job_id)
        });
        if (existingJob) {
            return res.status(409).json({
                Status: 'Failed',
                Message: 'checklist Already Submitted',
                Data: {},
                Code: 409
            });
        }

        const submittedChecklist = await SubmittedChecklistModel.create(req.body);
        const updateJobStatus = await jobManagementModel.findOneAndUpdate(
            { _id: new ObjectId(req.body.jobId) },
            { $set: { jobStatus: jobStatus.JOB_COMPLETED } }
        );
        return res.status(200).json({
            Status: 'Success',
            Message: 'CheckList Submitted successfully',
            Data: submittedChecklist,
            Code: 200
        });
    } catch (error) {
        console.error('Error Submitting checklist:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/getlist', VerifyToken, async (req, res) => {
    try {
        const submittedChecklist = await SubmittedChecklistModel.find({});
        return res.status(200).json({
            Status: 'Success',
            Message: 'Checklist retrieved successfully',
            Data: submittedChecklist,
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

Router.get('/submittedchecklist/:id', VerifyToken, async (req, res) => {
    try {
        const userType = await SubmittedChecklistModel.findById(req.params.id);
        if (!userType) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'checklist not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'Checklist retrieved successfully',
            Data: userType,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching checklist:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.put('/update/:id', VerifyToken, async (req, res) => {
    try {
        const updatedUserType = await SubmittedChecklistModel.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Return updated document
        if (!updatedUserType) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Checklist not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'checklist updated successfully',
            Data: updatedUserType,
            Code: 200
        });
    } catch (error) {
        console.error('Error updating checklist:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.delete('/cheklist/:id', VerifyToken, async (req, res) => {
    try {
        const deletedCheklist = await SubmittedChecklistModel.findByIdAndDelete(req.params.id);
        if (!deletedCheklist) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'checklist not found',
                Data: {},
                Code: 404
            });
        }

        return res.status(200).json({
            Status: 'Success',
            Message: 'checklist deleted successfully',
            Data: deletedCheklist,
            Code: 200
        });
    } catch (error) {
        console.error('Error deleting checklist:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/listsubmittedjobs', VerifyToken, async (req, res) => {
    try {
        const jobList = await jobManagementModel.find(
            {
                jobStatus: jobStatus.JOB_COMPLETED
            },
            {},
            { sort: { createdAt: -1 } }
        );

        return res.status(200).json({
            Status: 'Success',
            Message: 'Submitted Job List retrieved successfully',
            Data: jobList,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching checklist:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

module.exports = Router;

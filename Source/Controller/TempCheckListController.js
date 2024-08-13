const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const tempChecklistModel = require('../Models/TempChecklistModel');
const { VerifyToken } = require('../Helpers/JWSToken');

//create checklist

Router.post('/create', VerifyToken, async (req, res) => {
    try {
        let record;
        const payload = req.body;
        const isJobExists = await tempChecklistModel.findOne({
            job_id: new ObjectId(payload.job_id) // replace job id
        });
        if (isJobExists) {
            record = await tempChecklistModel.findOneAndUpdate(
                { job_id: new ObjectId(isJobExists.job_id) },
                { data_store: [...payload.data_store] }
            );
            return res.status(201).json({
                Status: 'Success',
                Message: 'temp checklist stored successfully',
                Data: record,
                Code: 201
            });
        } else {
            record = await tempChecklistModel.create({
                ...payload
            });
            return res.status(201).json({
                Status: 'Success',
                Message: 'temp checklist stored successfully',
                Data: record,
                Code: 201
            });
        }
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

// Get all checklists
Router.get('/list', VerifyToken, async (req, res) => {
    try {
        const checkLists = await tempChecklistModel.find();
        res.json({
            Status: 'Success',
            Message: 'checklist fetched successfully',
            Data: checkLists,
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

// Get checklist by ID
Router.get('/getdata/:id', VerifyToken, async (req, res) => {
    try {
        const checklistById = await tempChecklistModel.findOne({
            job_id: new ObjectId(req.params.id) //replace with job id
        });
        if (!checklistById) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'temp checklist not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'temp checklist fetched successfully',
            Data: checklistById,
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

// Update checklist by ID
Router.put('/updatechecklist/:id', VerifyToken, async (req, res) => {
    try {
        const updatedChecklist = await tempChecklistModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedChecklist) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'checklist not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'checklist updated successfully',
            Data: updatedChecklist,
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

// Delete checklist by ID
Router.delete('/removechecklist/:id', VerifyToken, async (req, res) => {
    try {
        const deleteChecklist = await tempChecklistModel.findByIdAndDelete(req.params.id);
        if (!deleteChecklist) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'checklist not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'checklist deleted successfully',
            Data: deleteChecklist,
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

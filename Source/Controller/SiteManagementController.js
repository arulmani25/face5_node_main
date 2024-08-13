const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const { VerifyToken } = require('../Helpers/JWSToken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const SiteManagementModel = require('../Models/SiteManagementModel');

// Create a new client

Router.post('/create', VerifyToken, async (req, res) => {
    try {
        if (!req.body.clientId || !req.body.siteName) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'clientId is required field',
                Data: {},
                Code: 400
            });
        }
        const newSite = await SiteManagementModel.create(req.body);
        return res.status(200).json({
            Status: 'Success',
            Message: 'Site created successfully',
            Data: newSite,
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

Router.get('/list', VerifyToken, async (req, res) => {
    try {
        const { searchKey, skip, limit, sortkey, sortOrder, clientId } = req.query;

        const sort = {
            [sortkey ? sortkey : 'createdAt']: !sortOrder || sortOrder === 'DESC' ? -1 : 1
        };

        const searchRegex = new RegExp(['^.*', searchKey, '.*$'].join(''), 'i');

        const siteList = await SiteManagementModel.aggregate([
            {
                $match: clientId ? { clientId: new ObjectId(clientId) } : {}
            },
            {
                $match: searchKey
                    ? {
                          $or: [{}]
                      }
                    : {}
            },
            {
                $sort: sort
            },
            {
                $facet: {
                    pagination: [{ $count: 'totalCount' }],
                    data: [{ $skip: Number(skip) || 0 }, { $limit: Number(limit) || 10 }]
                }
            }
        ]);
        return res.status(200).json({
            Status: 'Success',
            Message: 'Sites retrieved successfully',
            Data: siteList,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching Sites:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/site/:id', VerifyToken, async (req, res) => {
    try {
        const siteInfo = await SiteManagementModel.findById(req.params.id);
        if (!siteInfo) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Site not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'Site retrieved successfully',
            Data: siteInfo,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching Site:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.delete('/delete/:id', VerifyToken, async (req, res) => {
    try {
        const removeSite = await SiteManagementModel.findByIdAndDelete(req.params.id);
        if (!removeSite) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Site not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Site deleted successfully',
            Data: removeSite,
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

Router.post('/update', VerifyToken, async (req, res) => {
    try {
        const updateSite = await SiteManagementModel.findByIdAndUpdate(req.body.id, req.body, {
            new: true
        });
        if (!updateSite) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Site not found',
                Data: {},
                Code: 404
            });
        }
        return res.json({
            Status: 'Success',
            Message: 'Site updated successfully',
            Data: updateSite,
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

module.exports = Router;

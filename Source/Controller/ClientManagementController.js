const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const { VerifyToken } = require('../Helpers/JWSToken');

const ClientManagementLocal = '../Models/ClientManagementModel';
const ClientManagementModel = require(ClientManagementLocal);

// Create a new client

Router.post('/create', VerifyToken, async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({
                Status: 'Failed',
                Message: 'email is required field',
                Data: {},
                Code: 400
            });
        }
        const newClient = await ClientManagementModel.create(req.body);
        return res.status(200).json({
            Status: 'Success',
            Message: 'Client created successfully',
            Data: newClient,
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
        const { searchKey, skip, limit, sortkey, sortOrder, status } = req.query;

        const sort = {
            [sortkey ? sortkey : 'createdAt']: !sortOrder || sortOrder === 'DESC' ? -1 : 1
        };

        const searchRegex = new RegExp(['^.*', searchKey, '.*$'].join(''), 'i');

        const clientList = await ClientManagementModel.aggregate([
            {
                $match: status ? { status: status } : {}
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
            Message: 'Clients retrieved successfully',
            Data: clientList,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching Clients:', error);
        return res.status(500).json({
            Status: 'Failed',
            Message: 'Internal Server Error',
            Data: {},
            Code: 500
        });
    }
});

Router.get('/client/:id', VerifyToken, async (req, res) => {
    try {
        const clientInfo = await ClientManagementModel.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Client not found',
                Data: {},
                Code: 404
            });
        }
        return res.status(200).json({
            Status: 'Success',
            Message: 'Client retrieved successfully',
            Data: clientInfo,
            Code: 200
        });
    } catch (error) {
        console.error('Error fetching Client:', error);
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
        const removeClient = await ClientManagementModel.findByIdAndDelete(req.params.id);
        if (!removeClient) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Client not found',
                Data: {},
                Code: 404
            });
        }
        res.json({
            Status: 'Success',
            Message: 'Client deleted successfully',
            Data: removeClient,
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
        const updateClient = await ClientManagementModel.findByIdAndUpdate(req.body.id, req.body, {
            new: true
        });
        if (!updateClient) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Client not found',
                Data: {},
                Code: 404
            });
        }
        return res.json({
            Status: 'Success',
            Message: 'Client updated successfully',
            Data: updateClient,
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

Router.put('/updatestatus/:id', VerifyToken, async (req, res) => {
    try {
        // Basic input validation
        const clientStatus = await ClientManagementModel.findById(req.params.id);
        if (!clientStatus) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Client not found',
                Data: {},
                Code: 404
            });
        }

        const clientStatusUpdate = await ClientManagementModel.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { status: req.body.status } }
        );

        return res.json({
            Status: 'Success',
            Message: 'Client Status updated successfully',
            Data: {},
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

Router.put('/linksite/:id', VerifyToken, async (req, res) => {
    try {
        // Basic input validation
        const getclient = await ClientManagementModel.findById(req.params.id);
        if (!getclient) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Client not found',
                Data: {},
                Code: 404
            });
        }

        const clientSiteLink = await ClientManagementModel.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { siteDetails: req.body.siteId } }
        );

        return res.json({
            Status: 'Success',
            Message: 'Client Site Linked successfully',
            Data: {},
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

Router.put('/unlinksite/:id', VerifyToken, async (req, res) => {
    try {
        // Basic input validation
        const getclient = await ClientManagementModel.findById(req.params.id);
        if (!getclient) {
            return res.status(404).json({
                Status: 'Failed',
                Message: 'Client not found',
                Data: {},
                Code: 404
            });
        }

        const clientSiteUnLink = await ClientManagementModel.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { siteDetails: req.body.siteId } }
        );

        return res.json({
            Status: 'Success',
            Message: 'Client Site UnLinked successfully',
            Data: {},
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

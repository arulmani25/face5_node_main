const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const ClientSchema = new mongoose.Schema({
    client_id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    siteDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SiteManagement' }],
    address: {
        fullAddress: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        lng: String,
        lat: String
    },
    phoneNumber: { type: String },
    countryCode: { type: String },
    gender: { type: String },
    profileImage: { type: String },
    Status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    accountNumber: { type: Number },
    GSTIN: { type: String },
    legalName: { type: String },
    aadhar: { type: Number },
    panCard: { type: String },
    bankMedia: { type: String },
    panCardMedia: { type: String },
    gstMedia: { type: String },
    isActive: {
        type: Boolean,
        default: true // By default, a new record is active
    }
});
ClientSchema.plugin(timestamps);
const ClientManagementModel = mongoose.model('ClientManagement', ClientSchema);

module.exports = ClientManagementModel;

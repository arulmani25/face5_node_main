const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const SiteSchema = new mongoose.Schema({
    site_id: { type: String },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientManagement',
        required: true
    },
    siteName: { type: String, required: true },
    siteCode: { type: String, unique: true },
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
    phoneNumber: { type: String, required: false },
    countryCode: { type: String, required: false },
    description: { type: String }
});
SiteSchema.plugin(timestamps);
SiteSchema.pre('save', async function (next) {
    const SiteManagement = this.constructor;
    let code = this.siteName.slice(0, 2).toUpperCase();
    let suffix = 1;

    while (await SiteManagement.findOne({ code })) {
        code = code.slice(0, code.length - 1) + suffix;
        suffix++;
    }
    this.siteCode = code;
    next();
});
const SiteManagementModel = mongoose.model('SiteManagement', SiteSchema);

module.exports = SiteManagementModel;

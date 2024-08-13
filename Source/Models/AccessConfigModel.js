const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const AccessConfigSchema = new mongoose.Schema({
    AccessConfig: { type: String },
    role: { type: mongoose.Types.ObjectId, ref: 'UserType' },
    sideBar: [
        {
            title: { type: String },
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false }
        }
    ]
});
AccessConfigSchema.plugin(timestamps);
const AccessConfig = mongoose.model('AccessConfig', AccessConfigSchema);
module.exports = AccessConfig;

const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

let SubAdminAccessSchema = new mongoose.Schema({
    sub_admin_id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    status: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    username: { type: String },
    password: { type: String },
    confirm_password: { type: String },
    access_location: { type: Array },
    isActive: { type: Boolean, default: true },
    last_login: { type: Date }
});
SubAdminAccessSchema.plugin(timestamps);
const SubAdminAccess = mongoose.model('sub_admin_access', SubAdminAccessSchema);

module.exports = SubAdminAccess;

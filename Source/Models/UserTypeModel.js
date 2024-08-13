const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const UserTypeSchema = new mongoose.Schema({
    user_type_id: { tpe: String },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    permissions: {
        type: Array
    }
});
UserTypeSchema.plugin(timestamps);
const UserType = mongoose.model('UserType', UserTypeSchema);

module.exports = UserType;

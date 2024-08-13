const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    clientId: { type: mongoose.Types.ObjectId },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    fcm_token: { type: String, default: "" },
    userType: { type: mongoose.Schema.Types.ObjectId, ref: 'UserType' }
});
UserSchema.plugin(timestamps);

const User = mongoose.model('User', UserSchema);

module.exports = User;

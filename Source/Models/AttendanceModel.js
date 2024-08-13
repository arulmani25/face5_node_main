const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const AttendanceSchema = new mongoose.Schema({
    attendance_id: { type: String },
    userName: {
        type: String
    },
    userPhoneNumber: {
        type: String,
        required: true
    },
    checkInTime: {
        type: String
    },
    checkOutTime: {
        type: String
    },
    lat: {
        type: String,
        require: true
    },
    lan: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});
AttendanceSchema.plugin(timestamps);
const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;

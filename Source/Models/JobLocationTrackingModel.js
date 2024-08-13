const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const JobLocationSchema = new mongoose.Schema({
    job_id: { type: String },
    techNumber: { type: String },
    location: { type: String },
    lat: { type: String },
    lng: { type: String },
    date: { type: Date },
    ativityType: { type: String },
    status: { type: String },
    isActive: {
        type: Boolean,
        default: true // By default, a new record is active
    }
});
JobLocationSchema.plugin(timestamps);
const JobLocationTracking = mongoose.model('jobLocationTracking', JobLocationSchema);

module.exports = JobLocationTracking;

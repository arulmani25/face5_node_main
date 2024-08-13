const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const JobDetailsSchema = new mongoose.Schema({
    job_deteils_id: { type: String },
    jobTitle: { type: String },
    jobId: { type: String },
    description: { type: String },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientManagement' },
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'SiteManagement' },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    },
    subActivityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subactivity'
    },
    checklistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'submittedChecklist'
    },
    jobDate: { type: Date },
    jobStatus: {
        type: String,
        enum: ['NOT STARTED', 'JOB STARTED', 'JOB PAUSED', 'JOB PAUSED', 'JOB COMPLETED'],
        default: 'NOT STARTED'
    },
    jobAddress: {
        address: { type: String },
        lat: { type: Number },
        lng: { type: Number }
    },
    contactNumber: { type: String },
    contactName: { type: String },
    techName: { type: String },
    techNumber: { type: String },
    is_Notification: {
        status : { type: Boolean, default: false}
    },
    is_master: { type: Boolean, default: false } // used for run cron to schedule job
});
JobDetailsSchema.plugin(timestamps);
const jobManagementModel = mongoose.model('jobDetails', JobDetailsSchema);

module.exports = jobManagementModel;

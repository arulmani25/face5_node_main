const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

const SubmittedChecklistSchema = new mongoose.Schema({
    submitted_checklist_id: { type: String },
    job_id: { type: ObjectId, ref: 'jobDetails' },
    start_time: { type: String },
    end_time: { type: String },
    submittedData: [
        {
            field_name: { type: String },
            field_value: { type: String }
        }
    ],
    images: [],
    is_active: { type: Boolean, default: true },
    submitted_by: { type: ObjectId, ref: 'User' },
    jobInfo: { type: Object }
});
SubmittedChecklistSchema.plugin(timestamps);

const SubmittedCheckList = mongoose.model('submittedChecklist', SubmittedChecklistSchema);
module.exports = SubmittedCheckList;

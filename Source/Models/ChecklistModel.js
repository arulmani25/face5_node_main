const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const objectId = mongoose.Schema.ObjectId;

const CheckListSchema = new mongoose.Schema({
    checklist_id: { type: String },
    index: { type: Number, required: true },
    field_name: { type: String, required: true },
    field_type: { type: String, required: true },
    field_length: { type: String },
    field_comments: { type: String },
    field_value: { type: String },
    drop_down: { type: Array },
    field_update_reason: { type: String },
    date_of_create: { type: Date },
    date_of_update: { type: Date },
    created_by: { type: objectId, ref: 'User' },
    updated_by: { type: objectId, ref: 'User' },
    main_activity_id: { type: objectId, required: true, ref: 'Activity' },
    sub_activity_id: { type: objectId, ref: 'Subactivity' },
    delete_status: { type: Boolean, default: false },
    field_required: { type: Boolean },
    check_list_type: {
        type: String,
        enum: []
    }
});
CheckListSchema.plugin(timestamps);
const CheckListModel = mongoose.model('checklist', CheckListSchema);

module.exports = CheckListModel;

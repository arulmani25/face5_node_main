const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const SubactivitySchema = new mongoose.Schema({
    sub_activity_id: { type: String },
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    parentActivity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    }
});
SubactivitySchema.plugin(timestamps);

SubactivitySchema.pre('save', async function (next) {
    const Subactivity = this.constructor;
    const activityId = this.parentActivity;
    console.log('========activityId', activityId);
    console.log('========Subactivity', Subactivity);
    const activity = await mongoose.model('Activity').findById(activityId);
    if (!activity) {
        throw new Error('Invalid parent activity for subactivity');
    }

    let code = activity.title.slice(0, 2).toUpperCase();
    let suffix = 1;

    while (await Subactivity.findOne({ code, activity: activityId })) {
        code = code.slice(0, code.length - 1) + suffix;
        suffix++;
    }
    this.code = code;
    next();
});

const Subactivity = mongoose.model('Subactivity', SubactivitySchema);
module.exports = Subactivity;

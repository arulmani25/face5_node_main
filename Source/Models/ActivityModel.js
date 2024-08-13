const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const ActivitySchema = new mongoose.Schema({
    activity_id: { type: String },
    title: { type: String, required: true },
    code: { type: String, unique: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    index: { type: Number, required: true, unique: true }
});
ActivitySchema.plugin(timestamps);

ActivitySchema.pre('save', async function (next) {
    const Activity = this.constructor;
    let code = this.title.slice(0, 2).toUpperCase();
    let suffix = 1;

    while (await Activity.findOne({ code })) {
        code = code.slice(0, code.length - 1) + suffix;
        suffix++;
    }
    this.code = code;
    next();
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;

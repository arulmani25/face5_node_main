let mongoose = require('mongoose');
let timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const ErrorLogSchema = new mongoose.Schema({
    error_log_id: { type: String },
    timestamp: { type: Date, default: Date.now },
    error: String,
    query: String,
    tableName: String,
    jobNo: String,
    bindParams: Schema.Types.Mixed,
    result: Array,
    errorType: String
});
ErrorLogSchema.plugin(timestamps);
const ErrorLogModel = mongoose.model('ErrorLog', ErrorLogSchema);

module.exports = ErrorLogModel;

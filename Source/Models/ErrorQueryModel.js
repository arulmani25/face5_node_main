let mongoose = require('mongoose');
let timestamps = require('mongoose-timestamp');

const ErrorQuerySchema = new mongoose.Schema({
    error_query_id: { type: String },
    query: {
        type: String,
        required: true
    },
    bindParams: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
});
ErrorQuerySchema.plugin(timestamps);
const ErrorQueryModel = mongoose.model('ErrorQuery', ErrorQuerySchema);

module.exports = ErrorQueryModel;

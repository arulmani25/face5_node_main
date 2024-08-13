const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const SubSidebarItemSchema = new mongoose.Schema({
    sub_sidebar_id: { Type: String },
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});
SubSidebarItemSchema.plugin(timestamps);

const SidebarItemSchema = new mongoose.Schema({
    sidebare_item: { type: String },
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true,
        unique: true
    },
    subItems: [SubSidebarItemSchema]
});
SidebarItemSchema.plugin(timestamps);
const SidebarItem = mongoose.model('SidebarItem', SidebarItemSchema);

module.exports = SidebarItem;

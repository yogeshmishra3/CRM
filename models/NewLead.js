
const mongoose = require('mongoose');

const newLeadSchema = new mongoose.Schema({
    leadName: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    organization: String,
    dealStatus: String,
    message: String,
    date: String,
});

module.exports = mongoose.model("NewLead", newLeadSchema);

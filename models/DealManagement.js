
const mongoose = require('mongoose');

const dealManagementSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Client Name
    leadName: { type: String, required: true }, // Deal Name
    stage: { type: String, required: true },
    amount: { type: Number, default: 0 },
    scheduledMeeting: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DealManagement", dealManagementSchema);


const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    name: String,
    leadName: String,
    owner: String,
    stage: {
        type: String,
        enum: ["Lead", "Contacted", "Proposal", "Qualified"],
        default: "Lead"
    },
    amount: Number,
    scheduledMeeting: Date
});

module.exports = mongoose.model("Deal", dealSchema);

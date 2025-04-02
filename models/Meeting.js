
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    note: { type: String, required: true },
    keyword: { type: String, required: true }
});

module.exports = mongoose.model("Meeting", meetingSchema);

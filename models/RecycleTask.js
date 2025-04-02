
const mongoose = require('mongoose');

const recycleSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    clientName: String,
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    archivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RecycleTask', recycleSchema);

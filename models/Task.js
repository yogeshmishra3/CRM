
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    clientName: String,
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);

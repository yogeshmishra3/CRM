
const mongoose = require('mongoose');

const projectDetailsSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    dueDate: { type: String, required: true },
    team: { type: [String] },
    status: { 
        type: String, 
        required: true, 
        enum: ['Open', 'In Progress', 'To Do', 'Completed'] 
    },
});

module.exports = mongoose.model('ProjectDetails', projectDetailsSchema);

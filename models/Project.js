
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    userResponsible: { type: String, required: true },
    dueDate: { type: String, required: true },
    team: [String],
    status: { 
        type: String, 
        enum: ['Open', 'In progress', 'Under review', 'Completed'], 
        required: true 
    },
});

module.exports = mongoose.model('Project', projectSchema);

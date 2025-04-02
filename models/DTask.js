
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    status: { type: String, required: true },
    percentage: { type: Number, required: true },
});

module.exports = mongoose.model('DTask', taskSchema);

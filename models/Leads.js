
const mongoose = require('mongoose');

const leadsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    team: { type: String, required: true },
    status: { type: String, required: true },
});

module.exports = mongoose.model('Leads', leadsSchema);

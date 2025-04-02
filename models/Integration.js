
const mongoose = require('mongoose');
const serviceSchema = require('./Service');

const integrationSchema = new mongoose.Schema({
    provider: { type: String, required: true },
    services: [serviceSchema],
}, { timestamps: true });

module.exports = mongoose.model("Integration", integrationSchema);

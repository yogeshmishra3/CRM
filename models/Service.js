
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dueDate: { type: Date, required: true },
    buyDate: { type: Date, required: true },
    serviceCost: { type: Number, required: true },
    renewalHistory: [
        {
            renewalCost: { type: Number, required: true },
            renewalDate: { type: Date, required: true },
            newDueDate: { type: Date, required: true }
        }
    ]
});

module.exports = serviceSchema;

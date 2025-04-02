
const mongoose = require('mongoose');

const financeDetailsSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    dealName: { type: String, required: true },
    clientName: { type: String, required: true },
    dueDate: { type: String },
    advancePayment: { type: Number, default: 0 },
    midPayment: { type: Number, default: 0 },
    finalPayment: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    balance: { type: Number, default: 0 },
    paymentDate: {
        advancedPDate: { type: String, default: null },
        midPDate: { type: String, default: null },
        finalPDate: { type: String, default: null }
    }
});

module.exports = mongoose.model('FinanceDetails', financeDetailsSchema);

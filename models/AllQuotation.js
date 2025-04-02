
const mongoose = require('mongoose');

const allQuotationSchema = new mongoose.Schema({
    dealName: String,
    clientName: String,
    totalCost: Number,
});

module.exports = mongoose.model("AllQuotation", allQuotationSchema);

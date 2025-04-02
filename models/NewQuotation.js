
const mongoose = require('mongoose');

const newQuotationSchema = new mongoose.Schema({
    clientName: String,
    dealName: String,
    Totalamount: Number,
    date: String,
    pdfUrl: String,
});

module.exports = mongoose.model("NewQuotation", newQuotationSchema);

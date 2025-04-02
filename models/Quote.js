
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    customer: { type: String, required: true },
    status: { type: String, enum: ["Accepted", "Not Accepted"], required: true },
    value: { type: Number, required: true },
});

module.exports = mongoose.model("Quote", quoteSchema);

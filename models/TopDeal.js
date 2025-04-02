
const mongoose = require('mongoose');

const topDealsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model('TopDeal', topDealsSchema);

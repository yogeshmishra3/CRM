
const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
    name: String,
    sales: Number,
    profit: Number,
});

module.exports = mongoose.model('Revenue', revenueSchema);

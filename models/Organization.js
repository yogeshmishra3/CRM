
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: { type: Number, required: true },
    balance: { type: Number, required: true },
});

module.exports = mongoose.model("Organization", organizationSchema);

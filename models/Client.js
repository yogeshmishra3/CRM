
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    companyname: { type: String, required: true },
    status: { type: String, required: true },
    dob: { type: Date, required: true },
    city: { type: String, required: true },
    industry: { type: String, required: true },
    note: { type: String },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ClientDetail", clientSchema);

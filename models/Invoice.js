
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    billTo: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    contactEmail: String,
    customerId: String,
    contactName: String,
    items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        amount: Number
    }],
    subtotal: Number,
    taxRate: Number,
    tax: Number,
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
invoiceSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);

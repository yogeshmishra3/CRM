
const mongoose = require('mongoose');

const clientProjectSchema = new mongoose.Schema(
    {
        leadName: {
            type: String,
            required: true,
            trim: true,
        },
        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        finalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        projectStatus: {
            type: String,
            enum: ['Active', 'On Hold', 'Completed'],
            required: true,
            default: 'Active',
        },
        projectId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        projectPassword: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ClientProject', clientProjectSchema);

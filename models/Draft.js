
const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
    fromEmail: { 
        type: String, 
        required: true,
        index: true
    },
    toEmail: { 
        type: String, 
        default: "" 
    },
    subject: { 
        type: String, 
        default: "" 
    },
    message: { 
        type: String, 
        default: "" 
    },
    attachment: {
        filename: String,
        contentType: String,
        size: Number,
        content: String
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        index: true
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Draft', draftSchema);

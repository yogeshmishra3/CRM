
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
        complaintID: {
            type: String,
            unique: true,
            required: true,
            default: function () {
                // Generates ID in the format TT-XXXXXX
                const randomNumbers = Math.floor(100000 + Math.random() * 900000); // 6 random digits
                return `TT-${randomNumbers}`;
            },
        },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        projectName: { type: String, required: true },
        category: { type: String, required: true },
        subject: { type: String, required: true },
        email: { type: String, required: true },
        preferredContact: { type: String, required: true },
        complaintDescription: { type: String, required: true },
        attachment: { type: String }, // Cloudinary URL
        status: {
            type: String,
            required: true,
            default: "Complaint Register Successfully , we will update you soon",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);


const Complaint = require('../models/Complaint');

// Submit a new complaint
exports.submitComplaint = async (req, res) => {
    try {
        const { fullName, phone, projectName, category, subject, email, preferredContact, complaintDescription, attachment } = req.body;

        // Validation - Ensure required fields are filled
        if (!fullName || !phone || !projectName || !category || !subject || !email || !complaintDescription) {
            return res.status(400).json({ message: "❌ All required fields must be filled." });
        }

        const newComplaint = new Complaint({
            fullName,
            phone,
            projectName,
            category,
            subject,
            email,
            preferredContact,
            complaintDescription,
            attachment, // Cloudinary URL is received from the frontend
        });

        await newComplaint.save();
        res.status(201).json({ message: "✅ Complaint submitted successfully!", complaintId: newComplaint._id });

    } catch (error) {
        console.error("❌ Error saving complaint:", error.message);
        res.status(500).json({ message: "❌ Internal server error. Try again later.", error: error.message });
    }
};

// Fetch all complaints
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaints", error });
    }
};

// Fetch a complaint by ID
exports.getComplaintById = async (req, res) => {
    try {
        const { complaintID } = req.params;

        // Find the complaint by complaintID
        const complaint = await Complaint.findOne({ complaintID });

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({
            message: "✅ Complaint fetched successfully",
            complaint,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaint", error });
    }
};

// Update a complaint
exports.updateComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const updatedComplaintData = req.body;  // The updated data sent from the client

        const complaint = await Complaint.findByIdAndUpdate(complaintId, updatedComplaintData, { new: true });

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint updated successfully", complaint });
    } catch (error) {
        res.status(500).json({ message: "Error updating complaint", error });
    }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const complaint = await Complaint.findByIdAndDelete(complaintId);  // Find and delete the complaint by ID

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting complaint", error });
    }
};

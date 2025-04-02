
const NewLead = require('../models/NewLead');

// Get all new leads
exports.getAllNewLeads = async (req, res) => {
    try {
        const leads = await NewLead.find({}, "leadName name email phone address organization dealStatus message date");
        res.status(200).json({ success: true, contacts: leads });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching leads", error: err.message });
    }
};

// Create a new lead
exports.createNewLead = async (req, res) => {
    const { leadName, name, email, phone, address, organization, dealStatus, message, date } = req.body;

    if (!leadName || !name || !email || !phone || !address || !dealStatus || !message || !date) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newLead = new NewLead({ leadName, name, email, phone, address, organization, dealStatus, message, date });
        await newLead.save();
        res.status(201).json({ success: true, message: "New lead created successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating new lead", error: err.message });
    }
};

// Update a lead
exports.updateNewLead = async (req, res) => {
    const { id } = req.params;
    const { leadName, name, email, phone, address, organization, dealStatus, message, date } = req.body;

    try {
        const updatedLead = await NewLead.findByIdAndUpdate(
            id,
            { leadName, name, email, phone, address, organization, dealStatus, message, date },
            { new: true }
        );

        if (!updatedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({ success: true, message: "Lead updated successfully", lead: updatedLead });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating lead", error: err.message });
    }
};

// Edit a lead
exports.editNewLead = async (req, res) => {
    console.log("Editing lead with ID:", req.params.id);
    const { id } = req.params;
    const { leadName, name, email, phone, address, dealStatus, message } = req.body;

    if (!leadName || !name || !email || !phone || !address || !dealStatus || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const updatedLead = await NewLead.findByIdAndUpdate(
            id,
            { leadName, name, email, phone, address, dealStatus, message },
            { new: true }
        );

        if (!updatedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({ success: true, message: "Lead updated successfully", lead: updatedLead });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating lead", error: error.message });
    }
};

// Delete a lead
exports.deleteNewLead = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLead = await NewLead.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting lead",
            error: err.message,
        });
    }
};

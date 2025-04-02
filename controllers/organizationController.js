
const Organization = require('../models/Organization');

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.json({ success: true, organizations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching organizations", error });
    }
};

// Add a new organization
exports.addOrganization = async (req, res) => {
    try {
        const { name, products, balance } = req.body;
        const newOrganization = new Organization({ name, products, balance });
        await newOrganization.save();
        res.json({ success: true, message: "Organization added successfully", organization: newOrganization });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error adding organization", error });
    }
};

// Update an organization
exports.updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, products, balance } = req.body;
        const updatedOrganization = await Organization.findByIdAndUpdate(
            id,
            { name, products, balance },
            { new: true }
        );
        res.json({ success: true, message: "Organization updated successfully", organization: updatedOrganization });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error updating organization", error });
    }
};

// Delete an organization
exports.deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        await Organization.findByIdAndDelete(id);
        res.json({ success: true, message: "Organization deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error deleting organization", error });
    }
};

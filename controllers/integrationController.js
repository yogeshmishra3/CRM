
const Integration = require('../models/Integration');

// Add new integration details
exports.addIntegration = async (req, res) => {
    const { provider, services } = req.body;

    if (!provider || !services || services.length === 0) {
        return res.status(400).json({ success: false, message: "Provider name and services are required." });
    }

    try {
        const newIntegration = new Integration({ provider, services });
        await newIntegration.save();

        res.status(201).json({ success: true, message: "Integration added successfully!", data: newIntegration });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding integration.", error: error.message });
    }
};

// Fetch all integrations
exports.getAllIntegrations = async (req, res) => {
    try {
        const integrations = await Integration.find();
        res.status(200).json({ success: true, data: integrations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching integrations.", error: error.message });
    }
};

// Fetch a single integration by ID
exports.getIntegrationById = async (req, res) => {
    const { id } = req.params;

    try {
        const integration = await Integration.findById(id);
        if (!integration) {
            return res.status(404).json({ success: false, message: "Integration not found." });
        }

        res.status(200).json({ success: true, data: integration });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching integration.", error: error.message });
    }
};

// Update an integration
exports.updateIntegration = async (req, res) => {
    try {
        const updatedIntegration = await Integration.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedIntegration) {
            return res.status(404).json({ success: false, message: "Integration not found." });
        }

        res.status(200).json({ success: true, data: updatedIntegration });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating integration.", error: error.message });
    }
};

// Delete integration
exports.deleteIntegration = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedIntegration = await Integration.findByIdAndDelete(id);
        if (!deletedIntegration) {
            return res.status(404).json({ success: false, message: "Integration not found." });
        }

        res.status(200).json({ success: true, message: "Integration deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting integration.", error: error.message });
    }
};

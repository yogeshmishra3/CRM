const Organization = require('../models/organizations.model');

exports.getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json({ success: true, organizations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching organizations', error: error.message });
    }
};

exports.addOrganization = async (req, res) => {
    const { name, type, date, customer, balance, total, status } = req.body;
    if (!name || !type || !date || !customer || !balance || !total || !status) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const newOrganization = new Organization({ name, type, date, customer, balance, total, status });
        await newOrganization.save();
        res.status(201).json({ success: true, message: 'Organization added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding organization', error: error.message });
    }
};

// Update and Delete Organization Routes

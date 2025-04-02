
const Leads = require('../models/Leads');

// Get all leads
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Leads.find();
        res.status(200).json({ success: true, Leads: leads });
    } catch (error) {
        console.error('Error fetching Leads:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Leads', error: error.message });
    }
};

// Create a new lead
exports.createLead = async (req, res) => {
    const { name, date, team, status } = req.body;
    if (!name || !date || !team || !status) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const lead = new Leads({ name, date, team, status });
        await lead.save();
        res.status(201).json({ success: true, message: 'Lead added', Leads: lead });
    } catch (error) {
        console.error('Error adding Lead:', error);
        res.status(500).json({ success: false, message: 'Error adding Lead', error: error.message });
    }
};

// Update a lead
exports.updateLead = async (req, res) => {
    const { id } = req.params;
    const { name, date, team, status } = req.body;
    try {
        const updatedLead = await Leads.findByIdAndUpdate(id, { name, date, team, status }, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.status(200).json({ success: true, message: 'Lead updated', Leads: updatedLead });
    } catch (error) {
        console.error('Error updating Lead:', error);
        res.status(500).json({ success: false, message: 'Error updating Lead', error: error.message });
    }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLead = await Leads.findByIdAndDelete(id);
        if (!deletedLead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.status(200).json({ success: true, message: 'Lead deleted' });
    } catch (error) {
        console.error('Error deleting Lead:', error);
        res.status(500).json({ success: false, message: 'Error deleting Lead', error: error.message });
    }
};


const DeletedLead = require('../models/DeletedLead');
const DealManagement = require('../models/DealManagement');

// Fetch archived leads (Recycle Bin)
exports.getArchivedLeads = async (req, res) => {
    try {
        const archivedLeads = await DeletedLead.find();
        res.json(archivedLeads);
    } catch (error) {
        res.status(500).json({ message: "Error fetching archived leads", error });
    }
};

// Restore an archived lead
exports.restoreArchivedLead = async (req, res) => {
    const { id } = req.params;
    try {
        const archivedLead = await DeletedLead.findById(id);

        if (!archivedLead) {
            return res.status(404).json({ message: "Archived lead not found" });
        }

        // Restore the lead to DealManagement collection with 'Qualified' stage
        const restoredLead = new DealManagement({
            name: archivedLead.name,
            leadName: archivedLead.leadName,
            amount: archivedLead.amount,
            stage: "Qualified", // Set stage to Qualified
            scheduledMeeting: archivedLead.scheduledMeeting,
        });
        await restoredLead.save();

        // Remove from DeleteLeads collection
        await DeletedLead.findByIdAndDelete(id);

        res.json({ message: "Lead restored successfully", restoredLead });
    } catch (error) {
        res.status(500).json({ message: "Error restoring lead", error });
    }
};

// Delete an archived lead permanently
exports.deleteArchivedLead = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLead = await DeletedLead.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ message: "Archived lead not found" });
        }

        res.json({ message: "Archived lead deleted permanently", deletedLead });
    } catch (error) {
        res.status(500).json({ message: "Error deleting archived lead", error });
    }
};

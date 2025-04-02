
const Deal = require('../models/Deal');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const deals = await Deal.find();
        res.json(deals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
};

// Add a new lead to transactions
exports.addTransaction = async (req, res) => {
    try {
        const { name, leadName, owner, stage, amount, scheduledMeeting } = req.body;
        const newDeal = new Deal({ name, leadName, owner, stage, amount, scheduledMeeting });
        await newDeal.save();
        res.status(201).json(newDeal);
    } catch (error) {
        res.status(400).json({ message: "Error adding lead", error });
    }
};

// Update the stage of a deal
exports.updateTransactionStage = async (req, res) => {
    try {
        const { stage } = req.body;

        // Validate stage transitions
        const validStages = ["Lead", "Contacted", "Proposal", "Qualified"];
        if (!validStages.includes(stage)) {
            return res.status(400).json({ message: "Invalid stage transition" });
        }

        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Enforce "Lead" can only go to "Contacted"
        if (deal.stage === "Lead" && stage !== "Contacted") {
            return res.status(400).json({ message: "Leads can only move to Contacted" });
        }

        // If moving to "Proposal" stage, remove any matching deals in "Contacted"
        if (stage === "Proposal") {
            // Find deals in "Contacted" with the same name
            const contactedDeals = await Deal.find({ stage: "Contacted", name: deal.name });

            // Remove those deals
            for (const contactedDeal of contactedDeals) {
                await Deal.findByIdAndDelete(contactedDeal._id);
            }
        }

        // Update the deal stage
        deal.stage = stage;
        await deal.save();
        res.json(deal);
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error });
    }
};

// Delete a deal from transactions
exports.deleteTransaction = async (req, res) => {
    try {
        const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
        if (!deletedDeal) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
};

// Schedule a meeting for a deal
exports.scheduleTransaction = async (req, res) => {
    try {
        const { scheduledMeeting } = req.body;
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        deal.scheduledMeeting = new Date(scheduledMeeting);
        await deal.save();
        res.json({ message: "Meeting scheduled successfully", deal });
    } catch (error) {
        res.status(500).json({ message: "Error scheduling meeting", error });
    }
};

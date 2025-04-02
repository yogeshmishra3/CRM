
const DealManagement = require('../models/DealManagement');
const DeletedLead = require('../models/DeletedLead');

// Get all deals
exports.getAllDeals = async (req, res) => {
    try {
        const deals = await DealManagement.find();
        res.json(deals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching deals", error });
    }
};

// Add a new lead manually
exports.addDeal = async (req, res) => {
    try {
        const { name, leadName, stage, amount, scheduledMeeting } = req.body;

        // Check for duplicates
        const existingDeal = await DealManagement.findOne({ leadName, name });
        if (existingDeal) {
            return res.status(400).json({ message: "Duplicate lead. Lead already exists." });
        }

        // Set scheduledMeeting to the current date if it's not provided
        const scheduledMeetingDate = scheduledMeeting ? new Date(scheduledMeeting) : new Date();

        const newDeal = new DealManagement({
            name,
            leadName,
            stage, // Use the provided stage, e.g., "Qualified"
            amount,
            scheduledMeeting: scheduledMeetingDate,
        });

        await newDeal.save();
        res.status(201).json(newDeal);
    } catch (error) {
        res.status(400).json({ message: "Error adding lead", error });
    }
};

// Update deal stage
exports.updateDealStage = async (req, res) => {
    const { id } = req.params;
    const { stage } = req.body;

    try {
        const deal = await DealManagement.findById(id);
        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        // Allow "Archived" and restoring from "Archived"
        const validStages = ["Lead", "Contacted", "Proposal", "Qualified", "Archived"];
        if (!validStages.includes(stage)) {
            return res.status(400).json({ message: "Invalid stage" });
        }

        // Check if the deal is being restored from "Archived"
        const isRestoring = deal.stage === "Archived" && stage !== "Archived";

        deal.stage = stage;
        await deal.save();

        // Handle restore logic if moving from "Archived" to another stage
        if (isRestoring) {
            console.log(`Deal ${deal._id} restored from Archived to ${stage}`);
            // You can add extra logic here, such as logging, notifications, or state updates
        }

        res.json({ message: `Deal updated successfully to stage: ${stage}`, deal });

    } catch (error) {
        res.status(500).json({ message: "Error updating deal", error: error.message });
    }
};

// Schedule a meeting for a deal
exports.scheduleDealMeeting = async (req, res) => {
    try {
        const { scheduledMeeting } = req.body;
        const deal = await DealManagement.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        deal.scheduledMeeting = new Date(scheduledMeeting);
        await deal.save();
        res.json({ message: "Meeting scheduled successfully", deal });
    } catch (error) {
        res.status(500).json({ message: "Error scheduling meeting", error });
    }
};

// Delete a deal
exports.deleteDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDeal = await DealManagement.findByIdAndDelete(id);

        if (!deletedDeal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        res.json({ message: "Deal deleted successfully", deletedDeal });
    } catch (error) {
        res.status(500).json({ message: "Error deleting deal", error });
    }
};

// Archive a deal (Move to DeleteLeads collection)
exports.archiveDeal = async (req, res) => {
    const { id } = req.params;
    try {
        const deal = await DealManagement.findById(id);

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        // Check if the deal is in 'Qualified' stage before archiving
        if (deal.stage !== "Qualified") {
            return res.status(400).json({ message: "Only qualified deals can be archived" });
        }

        // Move the deal to DeleteLeads collection
        const archivedLead = new DeletedLead({
            name: deal.name,
            leadName: deal.leadName,
            amount: deal.amount,
            stage: deal.stage,
            scheduledMeeting: deal.scheduledMeeting,
        });
        await archivedLead.save();

        // Delete the deal from DealManagement
        await DealManagement.findByIdAndDelete(id);

        res.json({ message: "Lead archived successfully", archivedLead });
    } catch (error) {
        res.status(500).json({ message: "Error archiving lead", error });
    }
};

// Sync new leads from external API
exports.syncNewLeads = async (req, res) => {
    try {
        const response = await fetch("https://crm-mu-sooty.vercel.app/api/NewLeads");
        if (!response.ok) {
            throw new Error("Failed to fetch leads from external API");
        }

        const data = await response.json();
        const connectedLeads = data.contacts.filter((lead) => lead.dealStatus === "connected");

        for (const lead of connectedLeads) {
            // Check for duplicates by leadName (Deal name) and name (Client name)
            const existingDeal = await DealManagement.findOne({
                leadName: lead.leadName,
                name: lead.name,
            });

            if (!existingDeal) {
                // Save the new lead to the database
                const newDeal = new DealManagement({
                    name: lead.name, // Client Name
                    leadName: lead.leadName, // Deal Name
                    stage: "Lead", // Default stage
                });
                await newDeal.save();
            }
        }

        res.json({ message: "Leads synchronized successfully" });
    } catch (error) {
        console.error("Error syncing leads:", error);
        res.status(500).json({ message: "Error syncing leads", error });
    }
};

// Delete duplicate deals
exports.deleteDuplicateDeals = async (req, res) => {
    try {
        const [dealsResponse, quotationsResponse] = await Promise.all([
            fetch("http://localhost:5001/api/dealmanagement"),
            fetch("http://localhost:5001/api/newquotations"),
        ]);

        if (!dealsResponse.ok || !quotationsResponse.ok) {
            throw new Error("Failed to fetch data.");
        }

        const dealsData = await dealsResponse.json();
        const quotationsData = await quotationsResponse.json();

        await deleteDuplicateDeals(dealsData, quotationsData);

        res.json({ message: "Duplicate deals deleted successfully" });
    } catch (error) {
        console.error("Error deleting duplicate deals:", error);
        res.status(500).json({ message: "Error deleting duplicate deals", error });
    }
};

// Function to delete duplicate deals based on matching dealName and clientName
const deleteDuplicateDeals = async (transactionsData, quotationsData) => {
    // Extract dealName & clientName from quotations
    const quotationMap = new Set(quotationsData.map(q => `${q.dealName} - ${q.clientName}`));

    // Filter deals that need to be deleted (stage = "Contacted" OR "Lead")
    const dealsToDelete = transactionsData
        .filter(deal =>
            (deal.stage === "Contacted" || deal.stage === "Lead") &&
            quotationMap.has(`${deal.leadName} - ${deal.name}`)
        )
        .map(deal => deal._id); // Extract only the IDs

    if (dealsToDelete.length === 0) {
        console.log("No duplicate deals found.");
        return;
    }

    try {
        console.log(`Deleting ${dealsToDelete.length} duplicate deals...`);

        // Delete all matching deals in a single query
        await DealManagement.deleteMany({ _id: { $in: dealsToDelete } });

        console.log("Duplicate deals deleted successfully.");
    } catch (error) {
        console.error("Error deleting duplicate deals:", error);
    }
};

// Sync quotations to deals
exports.syncQuotationsToDeals = async (req, res) => {
    try {
        // Fetch quotations data
        const quotationsResponse = await fetch("http://localhost:5001/api/newquotations");

        if (!quotationsResponse.ok) {
            throw new Error("Failed to fetch quotations");
        }

        const quotationsData = await quotationsResponse.json();

        // Loop over each quotation to create a new deal
        for (const quotation of quotationsData) {
            const { dealName, clientName, quotationNo } = quotation;

            // Check if a deal already exists with the same dealName and clientName
            const existingDeal = await DealManagement.findOne({
                leadName: dealName,
                name: clientName,
            });

            // If no deal exists, create a new deal
            if (!existingDeal) {
                const newDeal = new DealManagement({
                    leadName: dealName, // Quotation dealName to leadName
                    name: clientName, // Quotation clientName to name
                    amount: quotationNo, // QuotationNo to amount
                    stage: "Proposal", // Set stage to Proposal
                });

                await newDeal.save();
            }
        }

        res.json({ message: "Quotations synced to deals successfully" });

    } catch (error) {
        console.error("Error syncing quotations to deals:", error);
        res.status(500).json({ message: "Error syncing quotations to deals", error });
    }
};

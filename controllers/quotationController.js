
const AllQuotation = require('../models/AllQuotation');
const NewQuotation = require('../models/NewQuotation');

// API Route to Save AllQuotation
exports.saveAllQuotation = async (req, res) => {
    try {
        const { dealName, clientName, totalCost } = req.body;
        const newQuotation = new AllQuotation({ dealName, clientName, totalCost });
        const savedQuotation = await newQuotation.save();
        res.status(201).json(savedQuotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to save quotation", details: err });
    }
};

// Fetch All AllQuotations
exports.getAllQuotations = async (req, res) => {
    try {
        const quotations = await AllQuotation.find();
        res.status(200).json(quotations);
    } catch (err) {
        res.status(400).json({ error: "Failed to fetch quotations", details: err });
    }
};

// Create a new quotation
exports.createNewQuotation = async (req, res) => {
    try {
        const { clientName, dealName, Totalamount, date, pdfUrl } = req.body;

        // Ensure date is formatted as YYYY-MM-DD
        const formattedDate = date ? new Date(date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

        const newQuotation = new NewQuotation({
            clientName,
            dealName,
            Totalamount,
            date: formattedDate,
            pdfUrl: pdfUrl,
        });

        const savedQuotation = await newQuotation.save();
        res.status(201).json(savedQuotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to create new quotation", details: err });
    }
};

// Get all new quotations
exports.getAllNewQuotations = async (req, res) => {
    try {
        const quotations = await NewQuotation.find({}, "clientName dealName Totalamount date pdfUrl");
        res.status(200).json(quotations);
    } catch (err) {
        res.status(400).json({ error: "Failed to fetch new quotations", details: err });
    }
};

// Get a single quotation by ID
exports.getNewQuotationById = async (req, res) => {
    try {
        const quotation = await NewQuotation.findById(req.params.id);
        if (!quotation) return res.status(404).json({ error: "New quotation not found" });
        res.status(200).json(quotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to fetch new quotation", details: err });
    }
};

// Update a quotation
exports.updateNewQuotation = async (req, res) => {
    try {
        const updatedQuotation = await NewQuotation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedQuotation) return res.status(404).json({ error: "New quotation not found" });
        res.status(200).json(updatedQuotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to update new quotation", details: err });
    }
};

// Delete a quotation
exports.deleteNewQuotation = async (req, res) => {
    try {
        const deletedQuotation = await NewQuotation.findByIdAndDelete(req.params.id);
        if (!deletedQuotation) return res.status(404).json({ error: "New quotation not found" });
        res.status(200).json({ message: "New quotation deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete new quotation", details: err });
    }
};

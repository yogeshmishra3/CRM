
const Quote = require('../models/Quote');

// Fetch all quotes
exports.getAllQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json({ success: true, quotes });
    } catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quotes" });
    }
};

// Add a new quote
exports.addQuote = async (req, res) => {
    try {
        const { date, title, customer, status, value } = req.body;
        if (!date || !title || !customer || !status || !value) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const newQuote = new Quote({ date, title, customer, status, value });
        await newQuote.save();
        res.json({ success: true, message: "Quote added successfully", quote: newQuote });
    } catch (error) {
        console.error("Error adding quote:", error);
        res.status(500).json({ success: false, message: "Failed to add quote" });
    }
};

// Edit an existing quote
exports.updateQuote = async (req, res) => {
    try {
        const { date, title, customer, status, value } = req.body;
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }
        quote.date = date || quote.date;
        quote.title = title || quote.title;
        quote.customer = customer || quote.customer;
        quote.status = status || quote.status;
        quote.value = value || quote.value;
        await quote.save();
        res.json({ success: true, message: "Quote updated successfully", quote });
    } catch (error) {
        console.error("Error updating quote:", error);
        res.status(500).json({ success: false, message: "Failed to update quote" });
    }
};

// Delete a quote
exports.deleteQuote = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }
        await Quote.deleteOne({ _id: req.params.id });
        res.json({ success: true, message: "Quote deleted successfully" });
    } catch (error) {
        console.error("Error deleting quote:", error);
        res.status(500).json({ success: false, message: "Failed to delete quote" });
    }
};


const Invoice = require('../models/Invoice');

// Create a new invoice
exports.createInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            billTo,
            contactPhone,
            date,
            contactEmail,
            customerId,
            contactName,
            items,
            subtotal,
            taxRate,
            tax,
            total
        } = req.body;

        const newInvoice = new Invoice({
            invoiceNumber,
            billTo,
            contactPhone,
            date,
            contactEmail,
            customerId,
            contactName,
            items,
            subtotal,
            taxRate,
            tax,
            total
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ date: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single invoice
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            billTo,
            contactPhone,
            date,
            contactEmail,
            customerId,
            contactName,
            items,
            subtotal,
            taxRate,
            tax,
            total
        } = req.body;

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                billTo,
                contactPhone,
                date,
                contactEmail,
                customerId,
                contactName,
                items,
                subtotal,
                taxRate,
                tax,
                total
            },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(updatedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

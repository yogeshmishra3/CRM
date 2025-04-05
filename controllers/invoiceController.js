
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
        console.log('Fetching all invoices...');
        const invoices = await Invoice.find().sort({ date: -1 });
        console.log(`Found ${invoices.length} invoices`);
        res.json(invoices);
    } catch (error) {
        console.error('Error in getAllInvoices:', error);
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

// Add this controller function
exports.createOrUpdateInvoice = async (req, res) => {
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
            total,
            _id // Optionally include _id in the request
        } = req.body;

        let invoice;
        
        // If we have an _id, update the existing invoice
        if (_id) {
            invoice = await Invoice.findByIdAndUpdate(
                _id,
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
        } 
        // Otherwise look up by invoice number
        else {
            // Try to find an invoice with the same invoice number
            const existingInvoice = await Invoice.findOne({ invoiceNumber });
            
            if (existingInvoice) {
                // Update existing invoice
                invoice = await Invoice.findByIdAndUpdate(
                    existingInvoice._id,
                    {
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
            } else {
                // Create new invoice
                invoice = new Invoice({
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
                await invoice.save();
            }
        }

        res.status(200).json(invoice);
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

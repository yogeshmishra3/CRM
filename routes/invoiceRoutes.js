
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Invoice routes
router.post('/invoices', invoiceController.createInvoice);
router.get('/invoices', invoiceController.getAllInvoices);
router.get('/invoices/:id', invoiceController.getInvoiceById);
router.put('/invoices/:id', invoiceController.updateInvoice);
router.delete('/invoices/:id', invoiceController.deleteInvoice);

module.exports = router;

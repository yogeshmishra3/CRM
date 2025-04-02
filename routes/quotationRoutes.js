
const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// Quotation routes
router.post('/allquotations', quotationController.saveAllQuotation);
router.get('/allquotations', quotationController.getAllQuotations);

router.post('/newquotations', quotationController.createNewQuotation);
router.get('/newquotations', quotationController.getAllNewQuotations);
router.get('/newquotations/:id', quotationController.getNewQuotationById);
router.put('/newquotations/:id', quotationController.updateNewQuotation);
router.delete('/newquotations/:id', quotationController.deleteNewQuotation);

module.exports = router;

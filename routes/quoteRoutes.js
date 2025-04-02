
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

// Quote routes
router.get('/quotes', quoteController.getAllQuotes);
router.post('/quotes', quoteController.addQuote);
router.put('/quotes/:id', quoteController.updateQuote);
router.delete('/quotes/:id', quoteController.deleteQuote);

module.exports = router;

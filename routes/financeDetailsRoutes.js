
const express = require('express');
const router = express.Router();
const financeDetailsController = require('../controllers/financeDetailsController');

// Finance details routes
router.post('/financeDetails', financeDetailsController.createOrUpdateFinanceDetails);
router.get('/financeDetails', financeDetailsController.getAllFinanceDetails);

module.exports = router;

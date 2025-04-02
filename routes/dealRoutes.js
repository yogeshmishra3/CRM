
const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

// Deal routes
router.get('/transactions', dealController.getAllTransactions);
router.post('/transactions', dealController.addTransaction);
router.put('/transactions/:id', dealController.updateTransactionStage);
router.delete('/transactions/:id', dealController.deleteTransaction);
router.put('/transactions/schedule/:id', dealController.scheduleTransaction);

module.exports = router;

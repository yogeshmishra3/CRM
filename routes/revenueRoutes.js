
const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

// Revenue routes
router.get('/data', revenueController.getRevenueData);
router.post('/data', revenueController.saveRevenueData);

module.exports = router;


const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');

// Lead routes
router.get('/Leads', leadsController.getAllLeads);
router.post('/Leads', leadsController.createLead);
router.put('/Leads/:id', leadsController.updateLead);
router.delete('/Leads/:id', leadsController.deleteLead);

module.exports = router;

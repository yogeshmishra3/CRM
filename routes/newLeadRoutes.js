
const express = require('express');
const router = express.Router();
const newLeadController = require('../controllers/newLeadController');

// New Lead routes
router.get('/NewLeads', newLeadController.getAllNewLeads);
router.post('/NewLeads', newLeadController.createNewLead);
router.put('/NewLeads/:id', newLeadController.updateNewLead);
router.put('/NewLeads/edit/:id', newLeadController.editNewLead);
router.delete('/NewLeads/:id', newLeadController.deleteNewLead);

module.exports = router;

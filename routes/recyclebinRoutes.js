
const express = require('express');
const router = express.Router();
const recyclebinController = require('../controllers/recyclebinController');

// Recycle bin routes
router.get('/recyclebin', recyclebinController.getArchivedLeads);
router.post('/recyclebin/restore/:id', recyclebinController.restoreArchivedLead);
router.delete('/recyclebin/:id', recyclebinController.deleteArchivedLead);

module.exports = router;

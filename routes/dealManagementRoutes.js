
const express = require('express');
const router = express.Router();
const dealManagementController = require('../controllers/dealManagementController');

// Deal management routes
router.get('/dealmanagement', dealManagementController.getAllDeals);
router.post('/dealmanagement', dealManagementController.addDeal);
router.put('/dealmanagement/:id', dealManagementController.updateDealStage);
router.delete('/dealmanagement/:id', dealManagementController.deleteDeal);
router.put('/dealmanagement/schedule/:id', dealManagementController.scheduleDealMeeting);
router.post('/dealmanagement/archive/:id', dealManagementController.archiveDeal);
router.get('/sync-newleads', dealManagementController.syncNewLeads);
router.get('/delete-duplicate-deals', dealManagementController.deleteDuplicateDeals);
router.get('/sync-quotations-to-deals', dealManagementController.syncQuotationsToDeals);

module.exports = router;

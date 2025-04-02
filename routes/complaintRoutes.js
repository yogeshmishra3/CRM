
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Complaint routes
router.post('/complaints', complaintController.submitComplaint);
router.get('/complaints', complaintController.getAllComplaints);
router.get('/complaints/:complaintID', complaintController.getComplaintById);
router.put('/complaints/:id', complaintController.updateComplaint);
router.delete('/complaints/:id', complaintController.deleteComplaint);

module.exports = router;

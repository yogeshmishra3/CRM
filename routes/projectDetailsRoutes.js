
const express = require('express');
const router = express.Router();
const projectDetailsController = require('../controllers/projectDetailsController');

// Project details routes
router.get('/projectsDetails', projectDetailsController.getAllProjectDetails);
router.post('/projectsDetails', projectDetailsController.createOrUpdateProjectDetails);

module.exports = router;

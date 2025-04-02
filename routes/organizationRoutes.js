
const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

// Organization routes
router.get('/organizations', organizationController.getAllOrganizations);
router.post('/organizations', organizationController.addOrganization);
router.put('/organizations/:id', organizationController.updateOrganization);
router.delete('/organizations/:id', organizationController.deleteOrganization);

module.exports = router;

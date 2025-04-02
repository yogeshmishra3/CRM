
const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');

// Integration routes
router.post('/integrations', integrationController.addIntegration);
router.get('/integrations', integrationController.getAllIntegrations);
router.get('/integrations/:id', integrationController.getIntegrationById);
router.put('/integrations/:id', integrationController.updateIntegration);
router.delete('/integrations/:id', integrationController.deleteIntegration);

module.exports = router;

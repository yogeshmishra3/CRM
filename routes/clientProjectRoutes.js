
const express = require('express');
const router = express.Router();
const clientProjectController = require('../controllers/clientProjectController');

// Client project routes
router.post('/client-projects', clientProjectController.saveClientProject);
router.get('/client-projects', clientProjectController.getAllClientProjects);

module.exports = router;

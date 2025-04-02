
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project routes
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

module.exports = router;

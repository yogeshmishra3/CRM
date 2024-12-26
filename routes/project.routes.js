const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/project.controller');

router.get('/', projectController.getProjects);
router.post('/', projectController.addProject);

module.exports = router;

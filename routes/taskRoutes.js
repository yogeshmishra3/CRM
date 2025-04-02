
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Task routes
router.get('/Newtasks', taskController.getAllTasks);
router.post('/Newtasks', taskController.createTask);
router.put('/Newtasks/archive/:id', taskController.archiveTask);
router.get('/Newrecycle-bin', taskController.getRecycleBin);
router.put('/Newrecycle-bin/restore/:id', taskController.restoreTask);
router.delete('/Newrecycle-bin/:id', taskController.deleteFromRecycleBin);
router.put('/tasks/:id/status', taskController.updateTaskStatus);
router.put('/Newtasks/edit/:id', taskController.updateTask);

module.exports = router;

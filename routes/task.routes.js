const express = require('express');
const { getTasks, addTask } = require('../controllers/task.controller');

const router = express.Router();
router.get('/', getTasks);
router.post('/', addTask);

module.exports = router;

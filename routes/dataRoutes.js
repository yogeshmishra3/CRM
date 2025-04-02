
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Data routes
router.post('/store', dataController.storeData);

module.exports = router;

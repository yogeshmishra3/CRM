const express = require('express');
const { storeData } = require('../controllers/data.controller');

const router = express.Router();
router.post('/store', storeData);

module.exports = router;

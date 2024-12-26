const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/contact.controller');

router.get('/', contactController.getContacts);
router.post('/', contactController.addContact);

module.exports = router;

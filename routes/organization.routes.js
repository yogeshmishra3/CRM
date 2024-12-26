const express = require('express');
const router = express.Router();
const organizationController = require('../Controllers/organization.controller');

router.get('/', organizationController.getOrganizations);
router.post('/', organizationController.addOrganization);

module.exports = router;

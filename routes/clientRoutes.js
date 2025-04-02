
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Client routes
router.get('/clientDetail', clientController.getAllClients);
router.get('/clientDetail/:id', clientController.getClientById);
router.post('/clientDetail', clientController.createClient);
router.put('/clientDetail/:id', clientController.updateClient);
router.delete('/clientDetail/:id', clientController.deleteClient);

module.exports = router;

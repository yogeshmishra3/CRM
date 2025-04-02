
const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// Meeting routes
router.get('/meetings/:date', meetingController.getMeetingsByDate);
router.post('/meetings', meetingController.createMeeting);
router.put('/meetings/update', meetingController.updateMeeting);
router.delete('/meetings/:id', meetingController.deleteMeeting);
router.delete('/meetings/:date', meetingController.deleteMeetingByDate);

module.exports = router;

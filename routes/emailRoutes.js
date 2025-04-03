
const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const emailController = require('../controllers/emailController');

// Configure multer for file uploads
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "application/pdf", "text/plain"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PNG, JPEG, PDF, and TXT are allowed."));
        }
    },
});

// Rate limiting middleware
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." },
});

// Draft routes
router.post('/send-email', emailLimiter, upload.single('attachment'), emailController.sendEmailController);
router.post('/save-draft', emailLimiter, upload.single('attachment'), emailController.saveDraftController);
router.put('/update-draft/:draftId', emailLimiter, upload.single('attachment'), emailController.updateDraftController);
router.get('/get-drafts', emailController.getDraftsController);
router.delete('/delete-draft/:draftId', emailController.deleteDraftController);
router.get('/get-draft/:draftId', emailController.getDraftController);

// Email fetching routes
router.get('/fetch-inbox-emails', emailController.fetchInboxEmailsController);
router.get('/fetch-sent-emails', emailController.fetchSentEmailsController);
router.get('/list-mailboxes', emailController.listMailboxesController);
router.post('/mark-as-read', emailController.markAsReadController);
router.get('/search-emails', emailController.searchEmailsController);

module.exports = router;

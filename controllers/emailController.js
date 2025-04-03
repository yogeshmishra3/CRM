
const Draft = require('../models/Draft');
const { 
    sendEmail, 
    fetchEmailsFromFolder, 
    listMailboxes, 
    markAsRead, 
    isAuthorized 
} = require('../services/emailService');
const { simpleParser } = require('mailparser');

// Send email
exports.sendEmailController = async (req, res) => {
    const { fromEmail, toEmail, subject, message } = req.body;
    const attachment = req.file;

    if (!fromEmail || !toEmail || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (!isAuthorized(fromEmail)) {
        return res.status(403).json({ error: "Unauthorized sender." });
    }

    try {
        await sendEmail(fromEmail, toEmail, subject, message, attachment);
        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("❌ Email send error:", error.message);
        res.status(500).json({ error: "Failed to send email. Please try again later." });
    }
};

// Save draft
exports.saveDraftController = async (req, res) => {
    const { fromEmail, toEmail, subject, message } = req.body;
    const attachment = req.file;

    if (!fromEmail) {
        return res.status(400).json({ error: "From email is required." });
    }

    if (!isAuthorized(fromEmail)) {
        return res.status(403).json({ error: "Unauthorized sender." });
    }

    try {
        // Create draft object
        const draftData = {
            fromEmail,
            toEmail: toEmail || "",
            subject: subject || "",
            message: message || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Add attachment if present
        if (attachment) {
            draftData.attachment = {
                filename: attachment.originalname,
                contentType: attachment.mimetype,
                size: attachment.size,
                content: attachment.buffer.toString('base64')
            };
        }

        // Save to MongoDB using Mongoose
        const draft = new Draft(draftData);
        await draft.save();

        res.json({
            success: true,
            message: "Draft saved successfully!",
            draftId: draft._id
        });
    } catch (error) {
        console.error("❌ Draft save error:", error.message);
        res.status(500).json({ error: "Failed to save draft. Please try again later." });
    }
};

// Update draft
exports.updateDraftController = async (req, res) => {
    const { draftId } = req.params;
    const { fromEmail, toEmail, subject, message } = req.body;
    const attachment = req.file;

    if (!fromEmail || !draftId) {
        return res.status(400).json({ error: "From email and draft ID are required." });
    }

    if (!isAuthorized(fromEmail)) {
        return res.status(403).json({ error: "Unauthorized sender." });
    }

    try {
        // Check if draft exists and belongs to this user
        const existingDraft = await Draft.findOne({
            _id: draftId,
            fromEmail: fromEmail
        });

        if (!existingDraft) {
            return res.status(404).json({ error: "Draft not found or unauthorized." });
        }

        // Update fields
        existingDraft.toEmail = toEmail || existingDraft.toEmail;
        existingDraft.subject = subject || existingDraft.subject;
        existingDraft.message = message || existingDraft.message;
        existingDraft.updatedAt = new Date();

        // Update attachment if provided
        if (attachment) {
            existingDraft.attachment = {
                filename: attachment.originalname,
                contentType: attachment.mimetype,
                size: attachment.size,
                content: attachment.buffer.toString('base64')
            };
        }

        await existingDraft.save();

        res.json({
            success: true,
            message: "Draft updated successfully!",
            draftId: draftId
        });
    } catch (error) {
        console.error("❌ Draft update error:", error.message);
        res.status(500).json({ error: "Failed to update draft. Please try again later." });
    }
};

// Get all drafts
exports.getDraftsController = async (req, res) => {
    const { fromEmail } = req.query;

    if (!fromEmail) {
        return res.status(400).json({ error: "From email is required." });
    }

    if (!isAuthorized(fromEmail)) {
        return res.status(403).json({ error: "Unauthorized sender." });
    }

    try {
        // Fetch drafts from MongoDB
        const drafts = await Draft.find({ fromEmail })
            .sort({ updatedAt: -1 });

        // Transform the drafts to not include the raw attachment content in the response
        const transformedDrafts = drafts.map(draft => {
            return {
                id: draft._id,
                fromEmail: draft.fromEmail,
                toEmail: draft.toEmail,
                subject: draft.subject,
                message: draft.message,
                createdAt: draft.createdAt,
                updatedAt: draft.updatedAt,
                hasAttachment: draft.attachment !== null && draft.attachment !== undefined,
                attachmentDetails: draft.attachment ? {
                    filename: draft.attachment.filename,
                    contentType: draft.attachment.contentType,
                    size: draft.attachment.size
                } : null
            };
        });

        res.json({
            success: true,
            drafts: transformedDrafts
        });
    } catch (error) {
        console.error("❌ Fetch drafts error:", error.message);
        res.status(500).json({ error: "Failed to fetch drafts. Please try again later." });
    }
};

// Delete draft
exports.deleteDraftController = async (req, res) => {
    const { draftId } = req.params;
    const { fromEmail } = req.query;

    if (!fromEmail || !draftId) {
        return res.status(400).json({ error: "From email and draft ID are required." });
    }

    if (!isAuthorized(fromEmail)) {
        return res.status(403).json({ error: "Unauthorized sender." });
    }

    try {
        // Delete draft from MongoDB
        const result = await Draft.deleteOne({
            _id: draftId,
            fromEmail: fromEmail
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Draft not found or unauthorized." });
        }

        res.json({
            success: true,
            message: "Draft deleted successfully!"
        });
    } catch (error) {
        console.error("❌ Delete draft error:", error.message);
        res.status(500).json({ error: "Failed to delete draft. Please try again later." });
    }
};

// Get single draft
exports.getDraftController = async (req, res) => {
    const { draftId } = req.params;
    const { fromEmail } = req.query;

    if (!fromEmail || !draftId) {
        return res.status(400).json({ error: "From email and draft ID are required." });
    }

    if (!isAuthorized(fromEmail)) {
        return res.status(403).json({ error: "Unauthorized sender." });
    }

    try {
        // Fetch draft from MongoDB
        const draft = await Draft.findOne({
            _id: draftId,
            fromEmail: fromEmail
        });

        if (!draft) {
            return res.status(404).json({ error: "Draft not found or unauthorized." });
        }

        // Transform the draft to include attachment details but not raw content
        const transformedDraft = {
            id: draft._id,
            fromEmail: draft.fromEmail,
            toEmail: draft.toEmail,
            subject: draft.subject,
            message: draft.message,
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt,
            hasAttachment: draft.attachment !== null && draft.attachment !== undefined,
            attachmentDetails: draft.attachment ? {
                filename: draft.attachment.filename,
                contentType: draft.attachment.contentType,
                size: draft.attachment.size
            } : null
        };

        res.json({
            success: true,
            draft: transformedDraft
        });
    } catch (error) {
        console.error("❌ Fetch draft error:", error.message);
        res.status(500).json({ error: "Failed to fetch draft. Please try again later." });
    }
};

// Fetch inbox emails
exports.fetchInboxEmailsController = async (req, res) => {
    const { email } = req.query;

    try {
        if (!email) return res.status(400).json({ error: "Email is required" });

        console.log("Fetching emails for:", email);

        const rawEmails = await fetchEmailsFromFolder(email, "INBOX");

        if (!Array.isArray(rawEmails) || rawEmails.length === 0) {
            return res.status(404).json({ error: "No emails found" });
        }

        // Parse each email and extract clean text
        const parsedEmails = await Promise.all(rawEmails.map(async (email) => {
            const parsed = await simpleParser(email.body);

            const cleanBody = parsed.text
                ? parsed.text.trim()
                : parsed.html
                    ? parsed.html.replace(/<\/?[^>]+>/g, "").trim() // Removes all HTML tags
                    : "No Content";

            return {
                id: email.id,
                from: email.from,
                to: email.to,
                subject: email.subject,
                date: email.date,
                body: cleanBody,
                isRead: email.isRead
            };
        }));

        res.json({ success: true, emails: parsedEmails });
    } catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

// Fetch sent emails
exports.fetchSentEmailsController = async (req, res) => {
    const { email } = req.query;
    try {
        const emails = await fetchEmailsFromFolder(email, "[Gmail]/Sent Mail");
        res.json({ success: true, emails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List mailboxes
exports.listMailboxesController = async (req, res) => {
    const { email } = req.query;
    try {
        const mailboxes = await listMailboxes(email);
        res.json({ success: true, mailboxes });
    } catch (error) {
        res.status(500).json({ error: "Failed to list mailboxes." });
    }
};

// Mark email as read
exports.markAsReadController = async (req, res) => {
    const { email, messageId, folder = "INBOX" } = req.body;

    try {
        await markAsRead(email, messageId, folder);
        res.json({ success: true, message: "Email marked as read." });
    } catch (error) {
        res.status(500).json({ error: "Failed to mark email as read." });
    }
};

// Search emails
exports.searchEmailsController = async (req, res) => {
    const { email, query, folder = "INBOX" } = req.query;

    try {
        const emails = await fetchEmailsFromFolder(email, folder);
        const filteredEmails = emails.filter(
            (email) =>
                email.subject.includes(query) || email.from.includes(query)
        );
        res.json({ success: true, emails: filteredEmails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

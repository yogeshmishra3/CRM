
const nodemailer = require('nodemailer');
const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');
require('dotenv').config();

// Authorized users (in a real app, store securely in .env)
const AUTHORIZED_USERS = {
    "yogibaba1207@gmail.com": process.env.APP_PASSWORD_YOGIBABA,
};

// Send email function
async function sendEmail(fromEmail, toEmail, subject, message, attachment = null) {
    if (!(fromEmail in AUTHORIZED_USERS)) {
        throw new Error("Unauthorized sender.");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: fromEmail,
            pass: AUTHORIZED_USERS[fromEmail],
        },
    });

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject,
        text: message,
        attachments: attachment
            ? [{ filename: attachment.originalname, content: attachment.buffer }]
            : [],
    };

    return await transporter.sendMail(mailOptions);
}

// Fetch emails from a folder
async function fetchEmailsFromFolder(email, folderName, limit = 20) {
    if (!email || !(email in AUTHORIZED_USERS)) {
        throw new Error("Unauthorized email account.");
    }

    const config = {
        imap: {
            user: email,
            password: AUTHORIZED_USERS[email],
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        },
    };

    const connection = await Imap.connect(config);
    await connection.openBox(folderName);

    const searchCriteria = ["ALL"];
    const fetchOptions = {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
        struct: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    const emails = messages.slice(0, limit).map((message) => {
        const headerPart = message.parts.find((part) =>
            part.which === "HEADER.FIELDS (FROM TO SUBJECT DATE)"
        );
        const bodyPart = message.parts.find((part) => part.which === "TEXT");

        return {
            id: message.attributes.uid,
            from: headerPart?.body.from?.[0] || "Unknown",
            to: headerPart?.body.to?.[0] || "Unknown",
            subject: headerPart?.body.subject?.[0] || "No Subject",
            date: headerPart?.body.date?.[0] || "Unknown Date",
            body: bodyPart?.body.toString() || "No Content",
            isRead: !message.attributes.flags.includes("\\Seen"),
        };
    });

    await connection.end();
    return emails;
}

// List all mailboxes
async function listMailboxes(email) {
    if (!(email in AUTHORIZED_USERS)) {
        throw new Error("Unauthorized email account.");
    }

    const config = {
        imap: {
            user: email,
            password: AUTHORIZED_USERS[email],
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        },
    };

    const connection = await Imap.connect(config);
    const boxes = await connection.getBoxes();
    await connection.end();

    return Object.keys(boxes);
}

// Mark email as read
async function markAsRead(email, messageId, folder = "INBOX") {
    if (!(email in AUTHORIZED_USERS)) {
        throw new Error("Unauthorized email account.");
    }

    const config = {
        imap: {
            user: email,
            password: AUTHORIZED_USERS[email],
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        },
    };

    const connection = await Imap.connect(config);
    await connection.openBox(folder);
    await connection.addFlags(messageId, "\\Seen");
    await connection.end();

    return true;
}

// Check if user is authorized
function isAuthorized(email) {
    return email in AUTHORIZED_USERS;
}

module.exports = {
    sendEmail,
    fetchEmailsFromFolder,
    listMailboxes,
    markAsRead,
    isAuthorized,
    AUTHORIZED_USERS
};

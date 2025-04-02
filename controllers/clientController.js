
const Client = require('../models/Client');

// Get all clients
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json({ success: true, clients });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching clients", error: err.message });
    }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        res.status(200).json({ success: true, client });
    } catch (err) {
        console.error("Error fetching client details:", err);
        res.status(500).json({ success: false, message: "Error fetching client details", error: err.message });
    }
};

// Create a new client
exports.createClient = async (req, res) => {
    try {
        let { clientId, name, email, phone, address, companyname, status, dob, city, industry, note } = req.body;

        console.log("Received client data:", req.body); // Log request body for debugging

        // Ensure clientId is provided and not null
        if (!clientId || clientId.trim() === "") {
            return res.status(400).json({ success: false, message: "Client ID must be provided" });
        }

        // Check if clientId is already in the database
        const existingClient = await Client.findOne({ clientId });
        if (existingClient) {
            return res.status(400).json({ success: false, message: "Client ID already exists" });
        }

        // Check if email already exists
        const existingEmail = await Client.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email address already exists. Duplicate email cannot be accepted." });
        }

        // Ensure other fields are valid
        if (!name || !email || !phone || !address || !companyname || !dob || !industry || !city) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        const parsedDob = new Date(dob);
        if (isNaN(parsedDob.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid Date of Birth format" });
        }

        // Save the client
        const newClient = new Client({
            clientId,
            name,
            email,
            phone,
            address,
            companyname,
            status,
            dob: parsedDob,
            city,
            industry,
            note,
        });

        const savedClient = await newClient.save();
        res.status(201).json({ success: true, client: savedClient });

    } catch (err) {
        console.error("Error creating client:", err);  // Detailed error log

        // Check for MongoDB duplicate key error (code 11000)
        if (err.code === 11000) {
            // Check if the error is related to email duplication
            if (err.keyPattern && err.keyPattern.email) {
                return res.status(400).json({
                    success: false,
                    message: "Email address already exists. Duplicate email cannot be accepted."
                });
            } else if (err.keyPattern && err.keyPattern.clientId) {
                return res.status(400).json({
                    success: false,
                    message: "Client ID already exists. Please use a different Client ID."
                });
            }
            // Generic duplicate key error
            return res.status(400).json({
                success: false,
                message: "Duplicate entry detected. Please check your data and try again."
            });
        }

        // Default error response
        res.status(500).json({ success: false, message: "Error creating client", error: err.message });
    }
};

// Update a client
exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId, name, email, phone, address, companyname, status, dob, city, industry, note } = req.body;

        if (!clientId || !name || !email || !phone || !address || !companyname || !dob || !industry || !city) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { clientId, name, email, phone, address, companyname, status, dob, city, industry, note },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        res.status(200).json({ success: true, client: updatedClient });
    } catch (err) {
        console.error("Error updating client:", err);
        res.status(500).json({ success: false, message: "Error updating client", error: err.message });
    }
};

// Delete a client
exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClient = await Client.findByIdAndDelete(id);

        if (!deletedClient) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        res.status(200).json({ success: true, message: "Client deleted successfully" });
    } catch (err) {
        console.error("Error deleting client:", err);
        res.status(500).json({ success: false, message: "Error deleting client", error: err.message });
    }
};

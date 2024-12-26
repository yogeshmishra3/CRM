const DataModel = require('../models/data.model');

exports.storeData = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ success: false, message: 'All fields are required' });
        const data = new DataModel({ name, email, message });
        await data.save();
        res.status(201).json({ success: true, message: 'Data saved' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving data', error: error.message });
    }
};

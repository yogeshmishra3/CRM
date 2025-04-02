
const Revenue = require('../models/Revenue');

// Fetch Revenue Data
exports.getRevenueData = async (req, res) => {
    try {
        const data = await Revenue.find();
        res.send(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ message: 'Error fetching data.' });
    }
};

// Save Revenue Data
exports.saveRevenueData = async (req, res) => {
    try {
        const newData = await Revenue.insertMany(req.body);
        res.send({ message: 'Data saved successfully!', data: newData });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send({ message: 'Error saving data.' });
    }
};

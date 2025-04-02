
const Meeting = require('../models/Meeting');

// Fetch meetings by date
exports.getMeetingsByDate = async (req, res) => {
    try {
        const meetings = await Meeting.find({ date: req.params.date });
        res.json({ meetings });
    } catch (error) {
        res.status(500).json({ message: "Error fetching meetings", error });
    }
};

// Add a new meeting
exports.createMeeting = async (req, res) => {
    try {
        const { date, startTime, endTime, note, keyword } = req.body;
        const newMeeting = new Meeting({ date, startTime, endTime, note, keyword });
        await newMeeting.save();
        res.status(201).json({ message: "Meeting saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving meeting", error });
    }
};

// Update an existing meeting
exports.updateMeeting = async (req, res) => {
    try {
        const { date, startTime, endTime, note, keyword } = req.body;
        const meeting = await Meeting.findOneAndUpdate(
            { date, startTime },
            { endTime, note, keyword },
            { new: true }
        );
        if (!meeting) return res.status(404).json({ message: "Meeting not found" });
        res.json({ message: "Meeting updated successfully", meeting });
    } catch (error) {
        res.status(500).json({ message: "Error updating meeting", error });
    }
};

// Delete a meeting
exports.deleteMeeting = async (req, res) => {
    try {
        const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
        if (!deletedMeeting) return res.status(404).json({ message: "Meeting not found" });
        res.json({ message: "Meeting deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting meeting", error });
    }
};

// Delete an entire meeting date
exports.deleteMeetingByDate = async (req, res) => {
    try {
        const { date } = req.params;

        const deletedMeeting = await Meeting.findOneAndDelete({ date });

        if (!deletedMeeting) {
            return res.status(404).json({ message: 'Meeting not found for the specified date' });
        }

        res.status(200).json({ message: 'Meeting deleted successfully', deletedMeeting });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meeting', error });
    }
};

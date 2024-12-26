const TaskModel = require('../models/task.model');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tasks', error: error.message });
    }
};

exports.addTask = async (req, res) => {
    try {
        const { taskName, taskDescription, taskStatus } = req.body;
        if (!taskName || !taskDescription || !taskStatus) return res.status(400).json({ success: false, message: 'All fields are required' });
        const task = new TaskModel({ taskName, taskDescription, taskStatus });
        await task.save();
        res.status(201).json({ success: true, message: 'Task added' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding task', error: error.message });
    }
};

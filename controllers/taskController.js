
const Task = require('../models/Task');
const RecycleTask = require('../models/RecycleTask');

// Fetch all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tasks", error });
    }
};

// Add a new task
exports.createTask = async (req, res) => {
    const { taskName, taskDescription, taskStatus, clientName, startDate, dueDate } = req.body;

    if (!taskName || !taskDescription || !taskStatus || !clientName || !startDate || !dueDate) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const task = new Task({ taskName, taskDescription, taskStatus, clientName, startDate, dueDate });
        await task.save();
        res.status(201).json({ success: true, message: "Task added", task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding task", error: error.message });
    }
};

// Archive a task (move to recycle bin)
exports.archiveTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const recycledTask = new RecycleTask({
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            taskStatus: task.taskStatus,
            clientName: task.clientName,
            startDate: task.startDate,
            dueDate: task.dueDate,
        });

        await recycledTask.save();
        await Task.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Task archived", recycledTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error archiving task", error: error.message });
    }
};

// Fetch tasks in recycle bin
exports.getRecycleBin = async (req, res) => {
    try {
        const recycledTasks = await RecycleTask.find();
        res.status(200).json({ success: true, recycledTasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching recycled tasks", error });
    }
};

// Restore a task from recycle bin
exports.restoreTask = async (req, res) => {
    const { id } = req.params;

    try {
        const recycledTask = await RecycleTask.findById(id);
        if (!recycledTask) {
            return res.status(404).json({ success: false, message: "Recycled task not found" });
        }

        const restoredTask = new Task({
            taskName: recycledTask.taskName,
            taskDescription: recycledTask.taskDescription,
            taskStatus: recycledTask.taskStatus,
            clientName: recycledTask.clientName,
            startDate: recycledTask.startDate,
            dueDate: recycledTask.dueDate,
        });

        await restoredTask.save();
        await RecycleTask.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Task restored", restoredTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error restoring task", error: error.message });
    }
};

// Permanently delete a task from recycle bin
exports.deleteFromRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await RecycleTask.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found in recycle bin" });
        }

        res.status(200).json({ success: true, message: "Task deleted permanently" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting task", error: error.message });
    }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { taskStatus } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { taskStatus },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task status updated", updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating task status", error });
    }
};

// Edit a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { taskName, taskDescription, taskStatus, clientName, startDate, dueDate } = req.body;

    if (!taskName || !taskDescription || !taskStatus || !clientName || !startDate || !dueDate) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { taskName, taskDescription, taskStatus, clientName, startDate, dueDate },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task updated", updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating task", error: error.message });
    }
};

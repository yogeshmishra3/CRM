const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(
    "mongodb+srv://YogeshMishra:yogeshmishraji@dogesh.4zht5.mongodb.net/?retryWrites=true&w=majority&appName=Dogesh",
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model for data
const DataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

const DataModel = mongoose.model('Data', DataSchema);

// Define a Mongoose schema and model for tasks
const TaskSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    createdAt: { type: Date, default: Date.now },
});

const TaskModel = mongoose.model('Task', TaskSchema);

// API Route to fetch all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find(); // Fetch all tasks from the database
        res.status(200).json(tasks); // Send the tasks as JSON response
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
    }
});

// API Route to store data
app.post('/api/store', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newData = new DataModel({ name, email, message });
        await newData.save();
        res.status(201).json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, message: 'Failed to save data' });
    }
});

// API Route to add a new task
app.post('/api/tasks', async (req, res) => {
    const { taskName, taskDescription, taskStatus } = req.body;
    const task = new TaskModel({
        taskName,
        taskDescription,
        taskStatus,
    });
    try {
        await task.save();
        res.status(201).json({ success: true, message: 'Task added' });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: 'Error adding task' });
    }
});

// Start the server
module.exports = (req, res) => {
    app(req, res); // Pass request and response to the express app
};

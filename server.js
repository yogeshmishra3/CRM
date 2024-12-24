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

// Define a Mongoose schema and model for projects
const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    team: { type: String, required: true },
    status: { type: String, required: true },
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

// Tasks APIs
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
    }
});

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

// Data APIs
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

// Projects APIs
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', async (req, res) => {
    const { name, date, team, status } = req.body;
    const project = new ProjectModel({
        name,
        date,
        team,
        status,
    });
    try {
        await project.save();
        res.status(201).json({ success: true, message: 'Project added', project });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ success: false, message: 'Error adding project' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, team, status } = req.body;
    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(
            id,
            { name, date, team, status },
            { new: true }
        );
        if (!updatedProject) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, message: 'Project updated', project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, message: 'Error updating project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProject = await ProjectModel.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, message: 'Project deleted', project: deletedProject });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, message: 'Error deleting project' });
    }
});

// Define Organization schema
const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    customer: { type: String, required: true },
    balance: { type: String, required: true },
    total: { type: String, required: true },
    status: { type: String, required: true },
});

const Organization = mongoose.model('Organization', OrganizationSchema);

// Fetch all organizations
app.get('/api/organizations', async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizations' });
    }
});

// Add new organization
app.post('/api/organizations', async (req, res) => {
    const { name, type, date, customer, balance, total, status } = req.body;
    try {
        const newOrganization = new Organization({
            name, type, date, customer, balance, total, status
        });
        await newOrganization.save();
        res.status(201).json({ message: 'Organization added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding organization' });
    }
});

// Edit organization
app.put('/api/organizations/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, date, customer, balance, total, status } = req.body;
    try {
        const updatedOrganization = await Organization.findByIdAndUpdate(id, {
            name, type, date, customer, balance, total, status
        }, { new: true });

        if (!updatedOrganization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json({ message: 'Organization updated successfully', updatedOrganization });
    } catch (error) {
        res.status(500).json({ message: 'Error updating organization' });
    }
});

// Delete organization
app.delete('/api/organizations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrganization = await Organization.findByIdAndDelete(id);
        if (!deletedOrganization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting organization' });
    }
});
// Get all quotes
app.get('/api/quotes', (req, res) => {
    res.json(quotesData);
});

// Get a specific quote by ID
app.get('/api/quotes/:id', (req, res) => {
    const quote = quotesData.find(q => q.id === parseInt(req.params.id));
    if (quote) {
        res.json(quote);
    } else {
        res.status(404).json({ message: 'Quote not found' });
    }
});

// Create a new quote
app.post('/api/quotes', (req, res) => {
    const { date, title, customer, status, value } = req.body;
    const newQuote = {
        id: quotesData.length + 1,
        date,
        title,
        customer,
        status,
        value
    };
    quotesData.push(newQuote);
    res.status(201).json(newQuote);
});

// Update a quote
app.put('/api/quotes/:id', (req, res) => {
    const quoteId = parseInt(req.params.id);
    const { date, title, customer, status, value } = req.body;

    let quote = quotesData.find(q => q.id === quoteId);
    if (quote) {
        quote = { ...quote, date, title, customer, status, value };
        quotesData = quotesData.map(q => (q.id === quoteId ? quote : q));
        res.json(quote);
    } else {
        res.status(404).json({ message: 'Quote not found' });
    }
});

// Delete a quote
app.delete('/api/quotes/:id', (req, res) => {
    const quoteId = parseInt(req.params.id);
    quotesData = quotesData.filter(q => q.id !== quoteId);
    res.status(204).send();
});
// GET all contacts
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

// POST (Create) a new contact
app.post('/contacts', async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const contact = new Contact({ name, email, phone, address });
        await contact.save();
        res.status(201).json({ message: 'Contact created successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating contact' });
    }
});

// PUT (Update) a contact
app.put('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        const contact = await Contact.findByIdAndUpdate(id, { name, email, phone, address }, { new: true });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error updating contact' });
    }
});

// DELETE a contact
app.delete('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
});
// Start the server
module.exports = (req, res) => {
    app(req, res); // Pass request and response to the express app
};

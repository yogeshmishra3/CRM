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
    "mongodb+srv://YogeshMishra:yogeshmishraji@dogesh.4zht5.mongodb.net/?retryWrites=true&w=majority&appName=Doges",
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Schemas and Models
const DataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});
const DataModel = mongoose.model('Data', DataSchema);

const TaskSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    createdAt: { type: Date, default: Date.now },
});
const TaskModel = mongoose.model('Task', TaskSchema);

const LeadsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    team: { type: String, required: true },
    status: { type: String, required: true },
});
const LeadsModel = mongoose.model('Leads', LeadsSchema);

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

const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
});
const Contact = mongoose.model('Contact', ContactSchema);

const dealSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    owner: String,
    stage: String,
});
const Deal = mongoose.model('Deal', dealSchema);

const projectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    userResponsible: { type: String, required: true },
    dueDate: { type: String, required: true },
    team: [String],
    status: { type: String, enum: ['Open', 'In progress', 'Under review', 'Completed'], required: true },
});

const Project = mongoose.model('Project', projectSchema);
// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a project by ID
app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
    const { id, name, userResponsible, dueDate, team, status } = req.body;

    const newProject = new Project({
        id,
        name,
        userResponsible,
        dueDate,
        team,
        status,
    });

    try {
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findOneAndDelete({ id: req.params.id });
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API Routes
// get all api
app.get('/api/deals', async (req, res) => {
    try {
        const deals = await Deal.find();
        res.json(deals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deals' });
    }
});

// Routes

// GET all deals
app.get('/api/deals', async (req, res) => {
    try {
        const deals = await Deal.find();
        res.json(deals);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching deals' });
    }
});

// POST a new deal
app.post('/api/deals', async (req, res) => {
    const { name, amount, owner, stage } = req.body;
    try {
        const newDeal = new Deal({ name, amount, owner, stage });
        await newDeal.save();
        res.status(201).json(newDeal);
    } catch (err) {
        res.status(400).json({ message: 'Error creating deal' });
    }
});

// PUT (update) a deal's stage
app.put('/api/deals/:id', async (req, res) => {
    const { id } = req.params;
    const { stage } = req.body;
    try {
        const updatedDeal = await Deal.findByIdAndUpdate(id, { stage }, { new: true });
        if (!updatedDeal) {
            return res.status(404).json({ message: 'Deal not found' });
        }
        res.json(updatedDeal);
    } catch (err) {
        res.status(500).json({ message: 'Error updating deal' });
    }
});



app.post('/api/deals', async (req, res) => {
    const { name, amount, owner, stage } = req.body;
    try {
        const deal = new Deal({ name, amount, owner, stage });
        await deal.save();
        res.status(201).json(newDeal);
    } catch (error) {
        res.status(400).json({ message: 'Error creating deal' });
    }
});
// delete a deal
app.delete('/api/deals/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deal = await Deal.findByIdAndDelete(id);
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }
        res.json({ message: 'Deal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting deal' });
    }
});

// Data APIs
app.post('/api/store', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const newData = new DataModel({ name, email, message });
        await newData.save();
        res.status(201).json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, message: 'Failed to save data', error: error.message });
    }
});

// Task API Routes

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
    }
});

// POST a new task
app.post('/api/tasks', async (req, res) => {
    const { taskName, taskDescription, taskStatus } = req.body;
    if (!taskName || !taskDescription || !taskStatus) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const task = new TaskModel({ taskName, taskDescription, taskStatus });
        await task.save();
        res.status(201).json({ success: true, message: 'Task added', task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding task', error: error.message });
    }
});

// PUT (update) a task's status
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { taskStatus } = req.body;
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(id, { taskStatus }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task status' });
    }
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await TaskModel.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

// Leads APIs
app.get('/api/Leads', async (req, res) => {
    try {
        const Leads = await LeadsModel.find();
        res.status(200).json({ success: true, Leads });
    } catch (error) {
        console.error('Error fetching Leads:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Leads', error: error.message });
    }
});

app.post('/api/Leads', async (req, res) => {
    const { name, date, team, status } = req.body;
    if (!name || !date || !team || !status) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const Leads = new LeadsModel({ name, date, team, status });
        await Leads.save();
        res.status(201).json({ success: true, message: 'Leads added', Leads });
    } catch (error) {
        console.error('Error adding Leads:', error);
        res.status(500).json({ success: false, message: 'Error adding Leads', error: error.message });
    }
});

app.put('/api/Leads/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, team, status } = req.body;
    try {
        const updatedLeads = await LeadsModel.findByIdAndUpdate(id, { name, date, team, status }, { new: true });
        if (!updatedLeads) {
            return res.status(404).json({ success: false, message: 'Leads not found' });
        }
        res.status(200).json({ success: true, message: 'Leads updated', Leads: updatedLeads });
    } catch (error) {
        console.error('Error updating Leads:', error);
        res.status(500).json({ success: false, message: 'Error updating Leads', error: error.message });
    }
});

app.delete('/api/Leads/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLeads = await LeadsModel.findByIdAndDelete(id);
        if (!deletedLeads) {
            return res.status(404).json({ success: false, message: 'Leads not found' });
        }
        res.status(200).json({ success: true, message: 'Leads deleted' });
    } catch (error) {
        console.error('Error deleting Leads:', error);
        res.status(500).json({ success: false, message: 'Error deleting Leads', error: error.message });
    }
});

// Organization APIs
app.get('/api/organizations', async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json({ success: true, organizations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching organizations', error: error.message });
    }
});

app.post('/api/organizations', async (req, res) => {
    const { name, type, date, customer, balance, total, status } = req.body;
    if (!name || !type || !date || !customer || !balance || !total || !status) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const newOrganization = new Organization({ name, type, date, customer, balance, total, status });
        await newOrganization.save();
        res.status(201).json({ success: true, message: 'Organization added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding organization', error: error.message });
    }
});

app.put('/api/organizations/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, date, customer, balance, total, status } = req.body;
    try {
        const updatedOrganization = await Organization.findByIdAndUpdate(
            id,
            { name, type, date, customer, balance, total, status },
            { new: true }
        );
        if (!updatedOrganization) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }
        res.status(200).json({ success: true, message: 'Organization updated successfully', organization: updatedOrganization });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating organization', error: error.message });
    }
});

app.delete('/api/organizations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrganization = await Organization.findByIdAndDelete(id);
        if (!deletedOrganization) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }
        res.status(200).json({ success: true, message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting organization', error: error.message });
    }
});

// Contact APIs
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ success: true, contacts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching contacts', error: err.message });
    }
});

app.post('/api/contacts', async (req, res) => {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const contact = new Contact({ name, email, phone, address });
        await contact.save();
        res.status(201).json({ success: true, message: 'Contact created successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating contact', error: err.message });
    }
});

app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    try {
        const contact = await Contact.findByIdAndUpdate(id, { name, email, phone, address }, { new: true });
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.status(200).json({ success: true, message: 'Contact updated successfully', contact });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating contact', error: err.message });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting contact', error: err.message });
    }
});



app.listen(5000, () => console.log('Server running on port 5000'));
// Export for serverless functions
module.exports = (req, res) => {
    app(req, res);
};



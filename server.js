const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');

// First Connection using mongoose.connect() (Main Database)
const MONGO_URI_MAIN = 'mongodb+srv://YogeshMishra:yogeshmishraji@dogesh.4zht5.mongodb.net/revenueData?retryWrites=true&w=majority&appName=Dogesh';
mongoose.connect(MONGO_URI_MAIN)
    .then(() => console.log('Connected to MongoDB Atlas (Main Database)'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas (Main Database):', err));

// Second Connection using mongoose.createConnection() (Secondary Database)
const MONGO_URI_SECONDARY = "mongodb+srv://YogeshMishra:yogeshmishraji@dogesh.4zht5.mongodb.net/?retryWrites=true&w=majority&appName=Dogesh";
const secondaryConnection = mongoose.createConnection(MONGO_URI_SECONDARY, { useNewUrlParser: true, useUnifiedTopology: true });

// Use the `open` event to check when the secondary connection is established
secondaryConnection.once('open', () => {
    console.log('Connected to MongoDB Atlas (Secondary Database)');
});

// Handle error for the secondary connection
secondaryConnection.on('error', (err) => {
    console.error('MongoDB connection error (Secondary Database):', err);
});

// You can now use `secondaryConnection` for queries related to the second database

// Define Schemas and Models
const DataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});
const DataModel = mongoose.model('Data', DataSchema);



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

// Define the Task Schema
const taskSchema = new mongoose.Schema({
    status: { type: String, required: true },
    percentage: { type: Number, required: true },
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

// Routes
// POST route to save task data
app.post('/api/IDTasks', async (req, res) => {
    try {
        const tasks = req.body;
        // Save each task to the database
        const savedTasks = await Task.insertMany(tasks);
        res.status(200).json(savedTasks);
    } catch (err) {
        console.error('Error saving tasks:', err);
        res.status(500).json({ message: 'Error saving task data.' });
    }
});

// GET route to fetch task data
app.get('/api/IDTasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Error fetching task data.' });
    }
});


// Task Schema
const TaskDataSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskStatus: { type: String, required: true },
    clientName: { type: String, required: true }
});

// Task Model (using custom collection name)
const TaskModel = mongoose.model('Task1', TaskDataSchema, 'myTasksFolder');

// GET all tasks
app.get('/api/taskss', async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json({ success: true, taskss });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
    }
});


// POST a new task
app.post('/api/taskss', async (req, res) => {
    const { taskName, taskDescription, taskStatus, clientName } = req.body;
    if (!taskName || !taskDescription || !taskStatus || !clientName) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const task = new TaskModel({ taskName, taskDescription, taskStatus, clientName });
        await task.save();
        res.status(201).json({ success: true, message: 'Task added', task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding task', error: error.message });
    }
});

// PUT (update) a task's status or client name
app.put('/api/taskss/:id', async (req, res) => {
    const { id } = req.params;
    const { taskStatus, clientName } = req.body;
    try {
        const updatedFields = {};
        if (taskStatus) updatedFields.taskStatus = taskStatus;
        if (clientName) updatedFields.clientName = clientName;

        const updatedTask = await TaskModel.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task updated successfully', task: updatedTask });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating task', error: err.message });
    }
});

// DELETE a task
app.delete('/api/taskss/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await TaskModel.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting task', error: error.message });
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

// Quotes APIs
let quotesData = [];

app.get('/api/quotes', (req, res) => {
    res.json({ success: true, quotes: quotesData });
});

app.get('/api/quotes/:id', (req, res) => {
    const quote = quotesData.find(q => q.id === parseInt(req.params.id));
    if (quote) {
        res.json({ success: true, quote });
    } else {
        res.status(404).json({ success: false, message: 'Quote not found' });
    }
});

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
    res.status(201).json({ success: true, quote: newQuote });
});

app.put('/api/quotes/:id', (req, res) => {
    const quoteId = parseInt(req.params.id);
    const { date, title, customer, status, value } = req.body;

    let quote = quotesData.find(q => q.id === quoteId);
    if (quote) {
        quote = { ...quote, date, title, customer, status, value };
        res.json({ success: true, quote });
    } else {
        res.status(404).json({ success: false, message: 'Quote not found' });
    }
});

app.delete('/api/quotes/:id', (req, res) => {
    const quoteId = parseInt(req.params.id);
    quotesData = quotesData.filter(q => q.id !== quoteId);
    res.status(200).json({ success: true, message: 'Quote deleted' });
});

// Quote Model
const Quote = mongoose.model("Quote", new mongoose.Schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    customer: { type: String, required: true },
    status: { type: String, enum: ["Accepted", "Not Accepted"], required: true },
    value: { type: Number, required: true },
}));

// Routes
// Fetch all quotes
app.get("/api/quotes", async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json({ success: true, quotes });
    } catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quotes" });
    }
});

// Add a new quote
app.post("/api/quotes", async (req, res) => {
    try {
        const { date, title, customer, status, value } = req.body;
        if (!date || !title || !customer || !status || !value) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const newQuote = new Quote({ date, title, customer, status, value });
        await newQuote.save();
        res.json({ success: true, message: "Quote added successfully", quote: newQuote });
    } catch (error) {
        console.error("Error adding quote:", error);
        res.status(500).json({ success: false, message: "Failed to add quote" });
    }
});

// Edit an existing quote
app.put("/api/quotes/:id", async (req, res) => {
    try {
        const { date, title, customer, status, value } = req.body;
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }
        quote.date = date || quote.date;
        quote.title = title || quote.title;
        quote.customer = customer || quote.customer;
        quote.status = status || quote.status;
        quote.value = value || quote.value;
        await quote.save();
        res.json({ success: true, message: "Quote updated successfully", quote });
    } catch (error) {
        console.error("Error updating quote:", error);
        res.status(500).json({ success: false, message: "Failed to update quote" });
    }
});

// Delete a quote
app.delete("/api/quotes/:id", async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }
        await quote.remove();
        res.json({ success: true, message: "Quote deleted successfully" });
    } catch (error) {
        console.error("Error deleting quote:", error);
        res.status(500).json({ success: false, message: "Failed to delete quote" });
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));
// Export for serverless functions
module.exports = (req, res) => {
    app(req, res);
};


const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Define a Schema for the Revenue Data
const revenueSchema = new mongoose.Schema({
    name: String,
    sales: Number,
    profit: Number,
});

// Create a Model for Revenue
const Revenue = mongoose.model('Revenue', revenueSchema);

// API to Fetch Revenue Data
app.get('/api/data', async (req, res) => {
    try {
        const data = await Revenue.find(); // Fetch all data from MongoDB
        res.send(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ message: 'Error fetching data.' });
    }
});

// API to Save Revenue Data
app.post('/api/data', async (req, res) => {
    try {
        const newData = await Revenue.insertMany(req.body); // Insert data into MongoDB
        res.send({ message: 'Data saved successfully!', data: newData });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send({ message: 'Error saving data.' });
    }
});

// Define a Schema for Top Deals Data
const topDealsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
});

const TopDeal = mongoose.model('TopDeal', topDealsSchema);

// API to Fetch Top Deals
app.get('/api/top-deals', async (req, res) => {
    try {
        const deals = await TopDeal.find();
        res.send(deals);
    } catch (err) {
        console.error('Error fetching top deals:', err);
        res.status(500).send({ message: 'Error fetching top deals.' });
    }
});

// API to Save Top Deals
app.post('/api/top-deals', async (req, res) => {
    try {
        const newDeals = await TopDeal.insertMany(req.body);
        res.send({ message: 'Top Deals saved successfully!', data: newDeals });
    } catch (err) {
        console.error('Error saving top deals:', err);
        res.status(500).send({ message: 'Error saving top deals.' });
    }
});

// Define Schema for Progress Data
// Task Progress Model
const progressSchema = new mongoose.Schema({
    status: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 }
});

const Progress = mongoose.model('Progress', progressSchema);





// Schema for Income and Expenses Data
const incomeExpenseSchema = new mongoose.Schema({
    date: { type: String, required: true },
    income: { type: Number, required: true },
    expenses: { type: Number, required: true },
});

const IncomeExpense = mongoose.model('IncomeExpense', incomeExpenseSchema);

// API to Save Income and Expenses Data
app.post('/api/income-expenses', async (req, res) => {
    try {
        const { date, income, expenses } = req.body;
        const newIncomeExpense = new IncomeExpense({ date, income, expenses });
        await newIncomeExpense.save();
        res.send({ message: 'Income/Expenses saved successfully!', data: newIncomeExpense });
    } catch (err) {
        console.error('Error saving income/expenses data:', err);
        res.status(500).send({ message: 'Error saving income/expenses.' });
    }
});

// Schema for Expenses by Category
const expenseSchema = new mongoose.Schema({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);





// API to Fetch Income and Expenses Data
app.get('/api/income-expenses', async (req, res) => {
    try {
        const data = await IncomeExpense.find();
        res.send(data);
    } catch (err) {
        console.error('Error fetching income/expenses data:', err);
        res.status(500).send({ message: 'Error fetching income/expenses.' });
    }
});

// API to Save Income and Expenses Data
app.post('/api/income-expenses', async (req, res) => {
    try {
        const { date, income, expenses } = req.body;
        const newIncomeExpense = new IncomeExpense({ date, income, expenses });
        await newIncomeExpense.save();
        res.send({ message: 'Income/Expenses saved successfully!', data: newIncomeExpense });
    } catch (err) {
        console.error('Error saving income/expenses data:', err);
        res.status(500).send({ message: 'Error saving income/expenses.' });
    }
});

// API to Save Expense Categories
app.post('/api/expenses', async (req, res) => {
    try {
        const { category, amount } = req.body;
        const newExpense = new Expense({ category, amount });
        await newExpense.save();
        res.send({ message: 'Expense category saved successfully!', data: newExpense });
    } catch (err) {
        console.error('Error saving expense category:', err);
        res.status(500).send({ message: 'Error saving expense category.' });
    }
});

app.get('/api/expenses', async (req, res) => {
    try {
      const expenses = await Expense.find(); // Fetch all expense categories from MongoDB
      res.send(expenses);
    } catch (err) {
      console.error('Error fetching expense categories:', err);
      res.status(500).send({ message: 'Error fetching expense categories.' });
    }
  });

  // Create Mongoose models (example structure for each section)
const Receivable = mongoose.model('Receivable', new mongoose.Schema({
    name: String,
    value: Number,
    color: String,
}));

const Payable = mongoose.model('Payable', new mongoose.Schema({
    name: String,
    value: Number,
    color: String,
}));

const CashBalance = mongoose.model('CashBalance', new mongoose.Schema({
    month: String,
    balance: Number,
}));

// For Receivable Data
app.post('/api/reports-data/receivable', async (req, res) => {
    try {
        const { overdue, due, total } = req.body;
        const newReceivable = new Receivable({
            name: 'Receivable',
            overdue,
            due,
            total
        });
        await newReceivable.save();
        res.status(200).json({ message: 'Receivable data saved successfully!' });
    } catch (err) {
        console.error('Error saving Receivable data:', err);
        res.status(500).json({ message: 'Error saving Receivable data' });
    }
});

// For Payable Data
app.post('/api/reports-data/payable', async (req, res) => {
    try {
        const { overdue, due, total } = req.body;
        const newPayable = new Payable({
            name: 'Payable',
            overdue,
            due,
            total
        });
        await newPayable.save();
        res.status(200).json({ message: 'Payable data saved successfully!' });
    } catch (err) {
        console.error('Error saving Payable data:', err);
        res.status(500).json({ message: 'Error saving Payable data' });
    }
});

// For Cash Balance Data
app.post('/api/reports-data/cashbalance', async (req, res) => {
    try {
        const data = req.body;
        const savedData = await CashBalance.insertMany(data);
        res.status(200).json(savedData);
    } catch (err) {
        console.error('Error saving cash balance data:', err);
        res.status(500).json({ message: 'Error saving data' });
    }
});

// GET route to fetch receivable data
app.get('/api/reports-data/receivable', async (req, res) => {
    try {
        // Make sure data is wrapped in an array, even if only one entry exists
        const data = await Receivable.find();
        res.status(200).json(data.length ? data : [{ name: 'Receivable', overdue: 0, due: 0, total: 0, color: '#0088FE' }]);
    } catch (err) {
        console.error('Error fetching receivable data:', err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// GET route to fetch payable data
app.get('/api/reports-data/payable', async (req, res) => {
    try {
        // Make sure data is wrapped in an array, even if only one entry exists
        const data = await Payable.find();
        res.status(200).json(data.length ? data : [{ name: 'Payable', overdue: 0, due: 0, total: 0, color: '#FF8042' }]);
    } catch (err) {
        console.error('Error fetching payable data:', err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});


// GET route to fetch cash balance data
app.get('/api/reports-data/cashbalance', async (req, res) => {
    try {
        const data = await CashBalance.find();
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching cash balance data:', err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

  
  

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
// Connect to MongoDB Atlas
mongoose.connect(
    "mongodb+srv://YogeshMishra:yogeshmishraji@dogesh.4zht5.mongodb.net/?retryWrites=true&w=majority&appName=Dogesh",
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

const LeadsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    team: { type: String, required: true },
    status: { type: String, required: true },
});
const LeadsModel = mongoose.model('Leads', LeadsSchema);

// Define project schema
const projectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    userResponsible: { type: String, required: true },
    dueDate: { type: String, required: true },
    team: [String],
    status: { type: String, enum: ['Open', 'In progress', 'Under review', 'Completed'], required: true },
});

// Create Project model
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
    const { name, userResponsible, dueDate, team, status } = req.body;

    try {
        const updatedProject = await Project.findOneAndUpdate(
            { id: req.params.id }, // Find the project by ID
            {
                name,
                userResponsible,
                dueDate,
                team, // Array of team members
                status
            },
            { new: true, runValidators: true } // Ensure that the returned object is the updated one and validate fields
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findOneAndDelete({ id: req.params.id });

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Define the schema for project details
const projectDetailsSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    dueDate: { type: String, required: true },
    team: { type: [String] },
    status: { type: String, required: true, enum: ['Open', 'In Progress', 'To Do', 'Completed'] },
});

// Create the model
const ProjectDetails = mongoose.model('ProjectDetails', projectDetailsSchema);

// POST route to handle project details creation
// POST route to handle project details creation or update
app.post('/api/projectsDetails', async (req, res) => {
    const { id, name, dueDate, team, status } = req.body;

    // Validate input
    if (!id || !name || !dueDate || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if project already exists
        let existingProject = await ProjectDetails.findOne({ id });

        if (existingProject) {
            // If project exists, update its details
            existingProject.dueDate = dueDate;
            existingProject.team = team;
            existingProject.status = status;

            const updatedProject = await existingProject.save();
            return res.status(200).json(updatedProject); // Return the updated project
        } else {
            // If project doesn't exist, create a new project
            const newProject = new ProjectDetails({
                id,
                name,
                dueDate,
                team,
                status,
            });

            const savedProject = await newProject.save();
            return res.status(201).json(savedProject); // Return the newly created project
        }
    } catch (error) {
        console.error('Error saving or updating project:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET route to fetch project details by ID
// Ensure this route is set up in your server.js
app.get('/api/projectsDetails', async (req, res) => {
    try {
        const projects = await ProjectDetails.find();  // This should return an array of projects
        res.status(200).json(projects); // Send the array of projects as response
    } catch (err) {
        console.error("Error fetching project details:", err);
        res.status(500).json({ message: 'Error fetching project details' });
    }
});



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



// Define the Task Schema
const taskSchema = new mongoose.Schema({
    status: { type: String, required: true },
    percentage: { type: Number, required: true },
});

// Create the Task model
const DTask = mongoose.model('DTask', taskSchema);

// POST route to save task data
app.post('/api/IDTasks', async (req, res) => {
    try {
        const tasks = req.body;
        // Save each task to the database
        const savedTasks = await DTask.insertMany(tasks);
        res.status(200).json(savedTasks);
    } catch (err) {
        console.error('Error saving tasks:', err);
        res.status(500).json({ message: 'Error saving task data.' });
    }
});

// GET route to fetch task data
app.get('/api/IDTasks', async (req, res) => {
    try {
        const tasks = await DTask.find();
        res.status(200).json({ tasks });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Error fetching task data.' });
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

// Task Schema
const TaskSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    clientName: String,
    startDate: { type: Date, required: true }, // Start date
    dueDate: { type: Date, required: true }, // Due date
    createdAt: { type: Date, default: Date.now },
});

const RecycleSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    clientName: String,
    startDate: { type: Date, required: true }, // Start date
    dueDate: { type: Date, required: true }, // Due date
    archivedAt: { type: Date, default: Date.now },
});

// Models
const TaskModel = mongoose.model("Task", TaskSchema);
const RecycleModel = mongoose.model("RecycleTask", RecycleSchema);

// API Routes

// Fetch all tasks
app.get("/api/Newtasks", async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tasks", error });
    }
});

// Add a new task
app.post("/api/Newtasks", async (req, res) => {
    const { taskName, taskDescription, taskStatus, clientName, startDate, dueDate } = req.body;

    if (!taskName || !taskDescription || !taskStatus || !clientName || !startDate || !dueDate) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const task = new TaskModel({ taskName, taskDescription, taskStatus, clientName, startDate, dueDate });
        await task.save();
        res.status(201).json({ success: true, message: "Task added", task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding task", error: error.message });
    }
});

// Archive a task (move to recycle bin)
app.put("/api/Newtasks/archive/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const task = await TaskModel.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const recycledTask = new RecycleModel({
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            taskStatus: task.taskStatus,
            clientName: task.clientName,
            startDate: task.startDate,
            dueDate: task.dueDate,
        });

        await recycledTask.save();
        await TaskModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Task archived", recycledTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error archiving task", error: error.message });
    }
});

// Fetch tasks in recycle bin
app.get("/api/Newrecycle-bin", async (req, res) => {
    try {
        const recycledTasks = await RecycleModel.find();
        res.status(200).json({ success: true, recycledTasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching recycled tasks", error });
    }
});

// Restore a task from recycle bin
app.put("/api/Newrecycle-bin/restore/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const recycledTask = await RecycleModel.findById(id);
        if (!recycledTask) {
            return res.status(404).json({ success: false, message: "Recycled task not found" });
        }

        const restoredTask = new TaskModel({
            taskName: recycledTask.taskName,
            taskDescription: recycledTask.taskDescription,
            taskStatus: recycledTask.taskStatus,
            clientName: recycledTask.clientName,
            startDate: recycledTask.startDate,
            dueDate: recycledTask.dueDate,
        });

        await restoredTask.save();
        await RecycleModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Task restored", restoredTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error restoring task", error: error.message });
    }
});

// Permanently delete a task from recycle bin
app.delete("/api/Newrecycle-bin/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const task = await RecycleModel.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found in recycle bin" });
        }

        res.status(200).json({ success: true, message: "Task deleted permanently" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting task", error: error.message });
    }
});

// Update task status
app.put("/api/tasks/:id/status", async (req, res) => {
    const { id } = req.params;
    const { taskStatus } = req.body;

    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
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
});

// Edit a task
app.put("/api/Newtasks/edit/:id", async (req, res) => {
    console.log("Editing task with ID:", req.params.id); // Add this line to check if the route is hit
    const { id } = req.params;
    const { taskName, taskDescription, taskStatus, clientName, startDate, dueDate } = req.body;

    if (!taskName || !taskDescription || !taskStatus || !clientName || !startDate || !dueDate) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
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

const NewLeadSchema = new mongoose.Schema({
    leadName: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    organization: String,  // Add this field
    dealStatus: String,
    message: String,
    date: String,  // Add this field
});


const NewLead = mongoose.model("NewLead", NewLeadSchema);


app.get("/api/NewLeads", async (req, res) => {
    try {
        const leads = await NewLead.find({}, "leadName name email phone address organization dealStatus message date");
        res.status(200).json({ success: true, contacts: leads });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching leads", error: err.message });
    }
});


app.post("/api/NewLeads", async (req, res) => {
    const { leadName, name, email, phone, address, organization, dealStatus, message, date } = req.body;

    if (!leadName || !name || !email || !phone || !address || !dealStatus || !message || !date) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newLead = new NewLead({ leadName, name, email, phone, address, organization, dealStatus, message, date });
        await newLead.save();
        res.status(201).json({ success: true, message: "New lead created successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating new lead", error: err.message });
    }
});




// PUT Route to Update Deal Status
app.put("/api/NewLeads/:id", async (req, res) => {
    const { id } = req.params;
    const { leadName, name, email, phone, address, organization, dealStatus, message, date } = req.body;

    try {
        const updatedLead = await NewLead.findByIdAndUpdate(
            id,
            { leadName, name, email, phone, address, organization, dealStatus, message, date },
            { new: true }
        );

        if (!updatedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({ success: true, message: "Lead updated successfully", lead: updatedLead });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating lead", error: err.message });
    }
});



app.put("/api/NewLeads/edit/:id", async (req, res) => {
    console.log("Editing lead with ID:", req.params.id); // Log to debug if the route is hit
    const { id } = req.params;
    const { leadName, name, email, phone, address, dealStatus, message } = req.body;

    // Check for missing fields
    if (!leadName || !name || !email || !phone || !address || !dealStatus || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Update the lead in the database
        const updatedLead = await NewLead.findByIdAndUpdate(
            id,
            { leadName, name, email, phone, address, dealStatus, message },
            { new: true } // Return the updated lead document
        );

        // Handle case where the lead is not found
        if (!updatedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        // Respond with success and the updated lead
        res.status(200).json({ success: true, message: "Lead updated successfully", lead: updatedLead });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ success: false, message: "Error updating lead", error: error.message });
    }
});


// Edit a lead
app.put("/api/NewLeads/edit/:id", async (req, res) => {
    console.log("Editing lead with ID:", req.params.id); // Log to debug if the route is hit
    const { id } = req.params;
    const { name, email, phone, address, dealStatus, message } = req.body;

    // Check for missing fields
    if (!name || !email || !phone || !address || !dealStatus || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Update the lead in the database
        const updatedLead = await NewLead.findByIdAndUpdate(
            id,
            { name, email, phone, address, dealStatus, message },
            { new: true } // Return the updated lead document
        );

        // Handle case where the lead is not found
        if (!updatedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        // Respond with success and the updated lead
        res.status(200).json({ success: true, message: "Lead updated successfully", lead: updatedLead });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ success: false, message: "Error updating lead", error: error.message });
    }
});



app.delete("/api/NewLeads/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLead = await NewLead.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting lead",
            error: err.message,
        });
    }
});

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
    empId: { type: String, required: true, unique: true }, // Employee ID (Unique)
    name: { type: String, required: true },               // Employee's full name
    email: { type: String, required: true, unique: true }, // Employee's email (Unique)
    phone: { type: String, required: true },               // Employee's phone number
    address: { type: String, required: true },             // Employee's home address
    department: { type: String, required: true },          // Department in which the employee works
    position: { type: String, required: true },            // Job position of the employee
    dateOfJoining: { type: Date, required: true },         // Date when employee joined the company
    dateOfBirth: { type: Date },                           // Date of birth of the employee (optional)
    salary: { type: Number, required: true },              // Salary of the employee
    manager: { type: String },                             // Name of the manager (optional)
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Employee status
    message: { type: String },                             // Any additional note or message
});

// Employee Model
const Employee = mongoose.model("Employee", EmployeeSchema);

// Routes

// Get all employees
app.get("/api/employees", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json({ success: true, employees });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching employees", error: err.message });
    }
});

// Get a single employee by ID
app.get("/api/employees/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.status(200).json({ success: true, employee });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching employee", error: err.message });
    }
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const { empId, name, email, phone, address, department, position, dateOfJoining, dateOfBirth, salary, manager, status, message } = req.body;

        // Validate the input fields
        if (!empId || !name || !email || !phone || !department || !position || !dateOfJoining || !salary) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        // Create a new employee
        const newEmployee = new Employee({
            empId,
            name,
            email,
            phone,
            address,
            department,
            position,
            dateOfJoining,
            dateOfBirth,
            salary,
            manager,
            status,
            message
        });

        // Save the employee to the database
        const savedEmployee = await newEmployee.save();
        return res.json({ success: true, employee: savedEmployee });
    } catch (error) {
        console.error("Error adding employee:", error);
        return res.status(500).json({ success: false, message: "Failed to add employee" });
    }
});


// Update employee details
app.put('/api/employees/:id', async (req, res) => {
    console.log('Update request received:', req.body); // Log the incoming data
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
        console.log('Updated employee:', updatedEmployee); // Log the updated data

        if (updatedEmployee) {
            return res.json({ success: true, employee: updatedEmployee });
        } else {
            return res.json({ success: false, message: "Employee not found" });
        }
    } catch (error) {
        console.error("Error updating employee:", error);
        return res.json({ success: false, message: "Failed to update employee" });
    }
});


// Delete an employee
app.delete("/api/employees/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

        if (!deletedEmployee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting employee", error: err.message });
    }
});

// Define Schema & Model
const empSalarySchema = new mongoose.Schema({
    empId: String,   // Employee ID
    name: String,
    year: Number,
    month: String,
    status: String,   // Paid / Unpaid
    amount: Number,
    salaryDate: Date  // New field for Salary Date
});

const EmpSalary = mongoose.model("EmpSalary", empSalarySchema);

// 1️⃣ Add or Update Salary Details
app.post("/add-salary", async (req, res) => {
    try {
        const { empId, name, year, month, status, amount, salaryDate } = req.body;

        let salaryRecord = await EmpSalary.findOne({ empId, year, month });

        if (salaryRecord) {
            salaryRecord.status = status;
            salaryRecord.amount = amount;
            salaryRecord.salaryDate = salaryDate;  // Update salaryDate if record exists
        } else {
            salaryRecord = new EmpSalary({ empId, name, year, month, status, amount, salaryDate });
        }

        await salaryRecord.save();
        res.json({ success: true, message: "Salary details saved successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2️⃣ Get Salary Details for an Employee by Year
app.get("/get-salary/:empId/:year", async (req, res) => {
    try {
        const { empId, year } = req.params;
        const salaries = await EmpSalary.find({ empId, year });

        res.json(salaries);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/get-all-salaries", async (req, res) => {
    try {
        const salaries = await EmpSalary.find(); // Fetch all salary records
        res.json(salaries);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});




const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dueDate: { type: Date, required: true },
    buyDate: { type: Date, required: true },
    serviceCost: { type: Number, required: true },
    renewalHistory: [
        {
            renewalCost: { type: Number, required: true },
            renewalDate: { type: Date, required: true },
            newDueDate: { type: Date, required: true }
        }
    ]
});



const IntegrationSchema = new mongoose.Schema({
    provider: { type: String, required: true },  // Provider Name
    services: [ServiceSchema],                   // List of Services
}, { timestamps: true });                        // Created and Updated timestamps

const Integration = mongoose.model("Integration", IntegrationSchema);

// Routes

// Add new integration details
app.post("/api/integrations", async (req, res) => {
    const { provider, services } = req.body;

    if (!provider || !services || services.length === 0) {
        return res.status(400).json({ success: false, message: "Provider name and services are required." });
    }

    try {
        const newIntegration = new Integration({ provider, services });
        await newIntegration.save();

        res.status(201).json({ success: true, message: "Integration added successfully!", data: newIntegration });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding integration.", error: error.message });
    }
});

// Fetch all integrations
app.get("/api/integrations", async (req, res) => {
    try {
        const integrations = await Integration.find();
        res.status(200).json({ success: true, data: integrations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching integrations.", error: error.message });
    }
});

// Fetch a single integration by ID
app.get("/api/integrations/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const integration = await Integration.findById(id);
        if (!integration) {
            return res.status(404).json({ success: false, message: "Integration not found." });
        }

        res.status(200).json({ success: true, data: integration });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching integration.", error: error.message });
    }
});

app.put("/api/integrations/:id", async (req, res) => {
    try {
        const updatedIntegration = await Integration.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedIntegration) {
            return res.status(404).json({ success: false, message: "Integration not found." });
        }

        res.status(200).json({ success: true, data: updatedIntegration });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating integration.", error: error.message });
    }
});

app.get("/api/integrations/:id", async (req, res) => {
    try {
        const integration = await Integration.findById(req.params.id);
        if (!integration) {
            return res.status(404).json({ success: false, message: "Integration not found." });
        }

        res.status(200).json({
            success: true,
            data: integration
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching integration.", error: error.message });
    }
});




// Delete integration
app.delete("/api/integrations/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedIntegration = await Integration.findByIdAndDelete(id);
        if (!deletedIntegration) {
            return res.status(404).json({ success: false, message: "Integration not found." });
        }

        res.status(200).json({ success: true, message: "Integration deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting integration.", error: error.message });
    }
});



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


app.listen(5000, () => console.log('Server running on port 5000'));
// Export for serverless functions
module.exports = (req, res) => {
    app(req, res);
};


// AllQuotations Schema
const allQuotationsSchema = new mongoose.Schema({
    dealName: String,
    clientName: String,
    totalCost: Number,
});

const AllQuotation = mongoose.model("AllQuotation", allQuotationsSchema);


// API Route to Save Only Required Data
app.post("/api/allquotations", async (req, res) => {
    try {
        const { dealName, clientName, totalCost } = req.body;
        const newQuotation = new AllQuotation({ dealName, clientName, totalCost });
        const savedQuotation = await newQuotation.save();
        res.status(201).json(savedQuotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to save quotation", details: err });
    }
});

// Fetch All Quotations
app.get("/api/allquotations", async (req, res) => {
    try {
        const quotations = await AllQuotation.find();
        res.status(200).json(quotations);
    } catch (err) {
        res.status(400).json({ error: "Failed to fetch quotations", details: err });
    }
});



// Backend: Update the Mongoose schema to store only required fields
const newQuotationSchema = new mongoose.Schema({
    clientName: String,
    dealName: String,
    Totalamount: Number,
    date: String, // Store date as a string in "YYYY-MM-DD" format
    pdfUrl: String,
});


const NewQuotation = mongoose.model("NewQuotation", newQuotationSchema);

// Update the POST route to only accept clientName, dealName, and Totalamount
app.post("/api/newquotations", async (req, res) => {
    try {
        const { clientName, dealName, Totalamount, date, pdfUrl } = req.body;

        // Ensure date is formatted as YYYY-MM-DD
        const formattedDate = date ? new Date(date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

        const newQuotation = new NewQuotation({
            clientName,
            dealName,
            Totalamount,
            date: formattedDate,
            pdfUrl: pdfUrl,
        });

        const savedQuotation = await newQuotation.save();
        res.status(201).json(savedQuotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to create new quotation", details: err });
    }
});



// Get all quotations
app.get("/api/newquotations", async (req, res) => {
    try {
        const quotations = await NewQuotation.find({}, "clientName dealName Totalamount date pdfUrl");
        res.status(200).json(quotations);
    } catch (err) {
        res.status(400).json({ error: "Failed to fetch new quotations", details: err });
    }
});


// Get a single quotation by ID
app.get("/api/newquotations/:id", async (req, res) => {
    try {
        const quotation = await NewQuotation.findById(req.params.id);
        if (!quotation) return res.status(404).json({ error: "New quotation not found" });
        res.status(200).json(quotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to fetch new quotation", details: err });
    }
});

// Update a quotation
app.put("/api/newquotations/:id", async (req, res) => {
    try {
        const updatedQuotation = await NewQuotation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedQuotation) return res.status(404).json({ error: "New quotation not found" });
        res.status(200).json(updatedQuotation);
    } catch (err) {
        res.status(400).json({ error: "Failed to update new quotation", details: err });
    }
});

// Delete a quotation
app.delete("/api/newquotations/:id", async (req, res) => {
    try {
        const deletedQuotation = await NewQuotation.findByIdAndDelete(req.params.id);
        if (!deletedQuotation) return res.status(404).json({ error: "New quotation not found" });
        res.status(200).json({ message: "New quotation deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete new quotation", details: err });
    }
});


const clientProjectSchema = new mongoose.Schema(
    {
        leadName: {
            type: String,
            required: true,
            trim: true,
        },
        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        finalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        projectStatus: {
            type: String,
            enum: ['Active', 'On Hold', 'Completed'],
            required: true,
            default: 'Active',
        },
        projectId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        projectPassword: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const ClientProject = mongoose.model('ClientProject', clientProjectSchema);

// ✅ POST Route - Save New ClientProject
app.post('/api/client-projects', async (req, res) => {
    try {
        const { leadName, clientName, finalAmount, projectStatus, projectId, projectPassword } = req.body;

        // Validate required fields
        if (!leadName || !clientName || !finalAmount || !projectStatus || !projectId || !projectPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for existing project ID
        const existingProject = await ClientProject.findOne({ projectId });
        if (existingProject) {
            return res.status(400).json({ message: 'Project ID already exists' });
        }

        // Save new project
        const newProject = new ClientProject({
            leadName,
            clientName,
            finalAmount,
            projectStatus,
            projectId,
            projectPassword,
        });

        await newProject.save();

        res.status(201).json({ message: 'Project saved successfully', project: newProject });
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ GET Route - Fetch All ClientProjects
app.get('/api/client-projects', async (req, res) => {
    try {
        const projects = await ClientProject.find();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Deal Schema
const dealSchema = new mongoose.Schema({
    name: String,
    leadName: String,
    owner: String,
    stage: {
        type: String,
        enum: ["Lead", "Contacted", "Proposal", "Qualified"],
        default: "Lead"
    },
    amount: Number,
    scheduledMeeting: Date
});

const Deal = mongoose.model("Deal", dealSchema);

// GET all transactions
app.get("/api/transactions", async (req, res) => {
    try {
        const deals = await Deal.find();
        res.json(deals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
});

// POST - Add a new lead to transactions
app.post("/api/transactions", async (req, res) => {
    try {
        const { name, leadName, owner, stage, amount, scheduledMeeting } = req.body;
        const newDeal = new Deal({ name, leadName, owner, stage, amount, scheduledMeeting });
        await newDeal.save();
        res.status(201).json(newDeal);
    } catch (error) {
        res.status(400).json({ message: "Error adding lead", error });
    }
});

// PUT - Update the stage of a deal
// PUT - Update the stage of a deal
app.put("/api/transactions/:id", async (req, res) => {
    try {
        const { stage } = req.body;

        // Validate stage transitions
        const validStages = ["Lead", "Contacted", "Proposal", "Qualified"];
        if (!validStages.includes(stage)) {
            return res.status(400).json({ message: "Invalid stage transition" });
        }

        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Enforce "Lead" can only go to "Contacted"
        if (deal.stage === "Lead" && stage !== "Contacted") {
            return res.status(400).json({ message: "Leads can only move to Contacted" });
        }

        // If moving to "Proposal" stage, remove any matching deals in "Contacted"
        if (stage === "Proposal") {
            // Find deals in "Contacted" with the same name
            const contactedDeals = await Deal.find({ stage: "Contacted", name: deal.name });

            // Remove those deals
            for (const contactedDeal of contactedDeals) {
                await Deal.findByIdAndDelete(contactedDeal._id);
            }
        }

        // Update the deal stage
        deal.stage = stage;
        await deal.save();
        res.json(deal);
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error });
    }
});


// DELETE - Remove a deal from transactions
app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
        if (!deletedDeal) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
});

// PUT - Schedule a meeting for a deal
app.put("/api/transactions/schedule/:id", async (req, res) => {
    try {
        const { scheduledMeeting } = req.body;
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        deal.scheduledMeeting = new Date(scheduledMeeting);
        await deal.save();
        res.json({ message: "Meeting scheduled successfully", deal });
    } catch (error) {
        res.status(500).json({ message: "Error scheduling meeting", error });
    }
});


// MongoDB Schema and Model for Deal
const DealSchema2 = new mongoose.Schema({
    name: String, // Client Name
    leadName: String, // Deal Name
    stage: {
        type: String,
        enum: ["Lead", "Contacted", "Proposal", "Qualified"],
        default: "Lead",
    },
    amount: Number,
    scheduledMeeting: { type: Date, default: null }, // Optional: Default null
});



// Sync new leads from external API
app.get("/api/sync-newleads", async (req, res) => {
    try {
        const response = await fetch("https://crm-mu-sooty.vercel.app/api/NewLeads");
        if (!response.ok) {
            throw new Error("Failed to fetch leads from external API");
        }

        const data = await response.json();
        const connectedLeads = data.contacts.filter((lead) => lead.dealStatus === "connected");

        for (const lead of connectedLeads) {
            // Check for duplicates by leadName (Deal name) and name (Client name)
            const existingDeal = await DealManagement.findOne({
                leadName: lead.leadName,
                name: lead.name,
            });

            if (!existingDeal) {
                // Save the new lead to the database
                const newDeal = new DealManagement({
                    name: lead.name, // Client Name
                    leadName: lead.leadName, // Deal Name
                    stage: "Lead", // Default stage
                });
                await newDeal.save();
            }
        }

        res.json({ message: "Leads synchronized successfully" });
    } catch (error) {
        console.error("Error syncing leads:", error);
        res.status(500).json({ message: "Error syncing leads", error });
    }
});

app.delete("/api/dealmanagement/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDeal = await DealManagement.findByIdAndDelete(id);

        if (!deletedDeal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        res.json({ message: "Deal deleted successfully", deletedDeal });
    } catch (error) {
        res.status(500).json({ message: "Error deleting deal", error });
    }
});

// GET all deals for the frontend
app.get("/api/dealmanagement", async (req, res) => {
    try {
        const deals = await DealManagement.find();
        res.json(deals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching deals", error });
    }
});

// Add a new lead manually
app.post("/api/dealmanagement", async (req, res) => {
    try {
        const { name, leadName, stage, amount, scheduledMeeting } = req.body;

        // Check for duplicates
        const existingDeal = await DealManagement.findOne({ leadName, name });
        if (existingDeal) {
            return res.status(400).json({ message: "Duplicate lead. Lead already exists." });
        }

        // Set scheduledMeeting to the current date if it's not provided
        const scheduledMeetingDate = scheduledMeeting ? new Date(scheduledMeeting) : new Date();

        const newDeal = new DealManagement({
            name,
            leadName,
            stage, // Use the provided stage, e.g., "Qualified"
            amount,
            scheduledMeeting: scheduledMeetingDate,
        });

        await newDeal.save();
        res.status(201).json(newDeal);
    } catch (error) {
        res.status(400).json({ message: "Error adding lead", error });
    }
});


// Update deal stage
app.put("/api/dealmanagement/:id", async (req, res) => {
    const { id } = req.params;
    const { stage } = req.body;

    try {
        const deal = await DealManagement.findById(id);
        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        // Allow "Archived" and restoring from "Archived"
        const validStages = ["Lead", "Contacted", "Proposal", "Qualified", "Archived"];
        if (!validStages.includes(stage)) {
            return res.status(400).json({ message: "Invalid stage" });
        }

        // Check if the deal is being restored from "Archived"
        const isRestoring = deal.stage === "Archived" && stage !== "Archived";

        deal.stage = stage;
        await deal.save();

        // Handle restore logic if moving from "Archived" to another stage
        if (isRestoring) {
            console.log(`Deal ${deal._id} restored from Archived to ${stage}`);
            // You can add extra logic here, such as logging, notifications, or state updates
        }

        res.json({ message: `Deal updated successfully to stage: ${stage}`, deal });

    } catch (error) {
        res.status(500).json({ message: "Error updating deal", error: error.message });
    }

});


// Schedule a meeting for a deal
app.put("/api/dealmanagement/schedule/:id", async (req, res) => {
    try {
        const { scheduledMeeting } = req.body;
        const deal = await DealManagement.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        deal.scheduledMeeting = new Date(scheduledMeeting);
        await deal.save();
        res.json({ message: "Meeting scheduled successfully", deal });
    } catch (error) {
        res.status(500).json({ message: "Error scheduling meeting", error });
    }
});

// Function to delete duplicate deals based on matching dealName and clientName
const deleteDuplicateDeals = async (transactionsData, quotationsData) => {
    // Extract dealName & clientName from quotations
    const quotationMap = new Set(quotationsData.map(q => `${q.dealName} - ${q.clientName}`));

    // Filter deals that need to be deleted (stage = "Contacted" OR "Lead")
    const dealsToDelete = transactionsData
        .filter(deal =>
            (deal.stage === "Contacted" || deal.stage === "Lead") &&
            quotationMap.has(`${deal.leadName} - ${deal.name}`)
        )
        .map(deal => deal._id); // Extract only the IDs

    if (dealsToDelete.length === 0) {
        console.log("No duplicate deals found.");
        return;
    }

    try {
        console.log(`Deleting ${dealsToDelete.length} duplicate deals...`);

        // Delete all matching deals in a single query
        await DealManagement.deleteMany({ _id: { $in: dealsToDelete } });

        console.log("Duplicate deals deleted successfully.");
    } catch (error) {
        console.error("Error deleting duplicate deals:", error);
    }
};

// Endpoint to delete duplicate deals
app.get("/api/delete-duplicate-deals", async (req, res) => {
    try {
        const [dealsResponse, quotationsResponse] = await Promise.all([
            fetch("http://localhost:5001/api/dealmanagement"),
            fetch("http://localhost:5001/api/newquotations"),
        ]);

        if (!dealsResponse.ok || !quotationsResponse.ok) {
            throw new Error("Failed to fetch data.");
        }

        const dealsData = await dealsResponse.json();
        const quotationsData = await quotationsResponse.json();

        await deleteDuplicateDeals(dealsData, quotationsData);

        res.json({ message: "Duplicate deals deleted successfully" });
    } catch (error) {
        console.error("Error deleting duplicate deals:", error);
        res.status(500).json({ message: "Error deleting duplicate deals", error });
    }
});

// Sync new quotations into dealmanagement with stage as "Proposal"
app.get("/api/sync-quotations-to-deals", async (req, res) => {
    try {
        // Fetch quotations data
        const quotationsResponse = await fetch("http://localhost:5001/api/newquotations");

        if (!quotationsResponse.ok) {
            throw new Error("Failed to fetch quotations");
        }

        const quotationsData = await quotationsResponse.json();

        // Loop over each quotation to create a new deal
        for (const quotation of quotationsData) {
            const { dealName, clientName, quotationNo } = quotation;

            // Check if a deal already exists with the same dealName and clientName
            const existingDeal = await DealManagement.findOne({
                leadName: dealName,
                name: clientName,
            });

            // If no deal exists, create a new deal
            if (!existingDeal) {
                const newDeal = new DealManagement({
                    leadName: dealName, // Quotation dealName to leadName
                    name: clientName, // Quotation clientName to name
                    amount: quotationNo, // QuotationNo to amount
                    stage: "Proposal", // Set stage to Proposal
                });

                await newDeal.save();
            }
        }

        res.json({ message: "Quotations synced to deals successfully" });

    } catch (error) {
        console.error("Error syncing quotations to deals:", error);
        res.status(500).json({ message: "Error syncing quotations to deals", error });
    }
});
// API Endpoint to Delete an Entire Meeting (Date) for a specific date
app.delete('/api/meetings/:date', async (req, res) => {
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
});

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: { type: Number, required: true },
    balance: { type: Number, required: true },
});

const Organization = mongoose.model("Organization", organizationSchema);

// Routes
// 1. Get all organizations
app.get("/api/organizations", async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.json({ success: true, organizations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching organizations", error });
    }
});

// 2. Add a new organization
app.post("/api/organizations", async (req, res) => {
    try {
        const { name, products, balance } = req.body;
        const newOrganization = new Organization({ name, products, balance });
        await newOrganization.save();
        res.json({ success: true, message: "Organization added successfully", organization: newOrganization });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error adding organization", error });
    }
});

// 3. Update an organization
app.put("/api/organizations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, products, balance } = req.body;
        const updatedOrganization = await Organization.findByIdAndUpdate(
            id,
            { name, products, balance },
            { new: true }
        );
        res.json({ success: true, message: "Organization updated successfully", organization: updatedOrganization });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error updating organization", error });
    }
});

// 4. Delete an organization
app.delete("/api/organizations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Organization.findByIdAndDelete(id);
        res.json({ success: true, message: "Organization deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error deleting organization", error });
    }
});

// **Complaint Schema**

const ComplaintSchema = new mongoose.Schema(
    {
        complaintID: {
            type: String,
            unique: true,
            required: true,
            default: function () {
                // Generates ID in the format TT-XXXXXX
                const randomNumbers = Math.floor(100000 + Math.random() * 900000); // 6 random digits
                return `TT-${randomNumbers}`;
            },
        },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        projectName: { type: String, required: true },
        category: { type: String, required: true },
        subject: { type: String, required: true },
        email: { type: String, required: true },
        preferredContact: { type: String, required: true },
        complaintDescription: { type: String, required: true },
        attachment: { type: String }, // Cloudinary URL
        status: {
            type: String,
            required: true,
            default: "Complaint Register Successfully , we will update you soon",

        }
    },
    { timestamps: true }
);
const Complaint = mongoose.model("Complaint", ComplaintSchema);

// **API to Submit a Complaint**
app.post("/api/complaints", async (req, res) => {
    try {
        const { fullName, phone, projectName, category, subject, email, preferredContact, complaintDescription, attachment } = req.body;

        // ✅ Validation - Ensure required fields are filled
        if (!fullName || !phone || !projectName || !category || !subject || !email || !complaintDescription) {
            return res.status(400).json({ message: "❌ All required fields must be filled." });
        }

        const newComplaint = new Complaint({
            fullName,
            phone,
            projectName,
            category,
            subject,
            email,
            preferredContact,
            complaintDescription,
            attachment, // Cloudinary URL is received from the frontend
        });

        await newComplaint.save();
        res.status(201).json({ message: "✅ Complaint submitted successfully!", complaintId: newComplaint._id });

    } catch (error) {
        console.error("❌ Error saving complaint:", error.message);
        res.status(500).json({ message: "❌ Internal server error. Try again later.", error: error.message });
    }
});

// **Fetch Complaint by ComplaintID**
// Fetch Complaint Details by Complaint ID
app.get("/api/complaints/:complaintID", async (req, res) => {
    try {
        const { complaintID } = req.params;

        // Find the complaint by complaintID
        const complaint = await Complaint.findOne({ complaintID });

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({
            message: "✅ Complaint fetched successfully",
            complaint,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaint", error });
    }
});

// **Fetch All Complaints**
app.get("/api/complaints", async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaints", error });
    }
});
// **Delete Complaint by ID**
app.delete("/api/complaints/:id", async (req, res) => {
    try {
        const complaintId = req.params.id;
        const complaint = await Complaint.findByIdAndDelete(complaintId);  // Find and delete the complaint by ID

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting complaint", error });
    }
});
// **Edit (Update) Complaint by ID**
app.put("/api/complaints/:id", async (req, res) => {
    try {
        const complaintId = req.params.id;
        const updatedComplaintData = req.body;  // The updated data sent from the client

        const complaint = await Complaint.findByIdAndUpdate(complaintId, updatedComplaintData, { new: true });

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint updated successfully", complaint });
    } catch (error) {
        res.status(500).json({ message: "Error updating complaint", error });
    }
});

// Define Finance Details Schema
const financeDetailsSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    dealName: { type: String, required: true },
    clientName: { type: String, required: true },
    dueDate: { type: String },
    advancePayment: { type: Number, default: 0 },
    midPayment: { type: Number, default: 0 },
    finalPayment: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    balance: { type: Number, default: 0 },
    paymentDate: {
        advancedPDate: { type: String, default: null },
        midPDate: { type: String, default: null },
        finalPDate: { type: String, default: null }
    }
});

// Create FinanceDetails model
const FinanceDetails = mongoose.model('FinanceDetails', financeDetailsSchema);

// POST route to create or update finance details
app.post('/api/financeDetails', async (req, res) => {
    const { id, dealName, clientName, dueDate, advancePayment, midPayment, finalPayment, amount, paymentDate } = req.body;

    if (!id || !dealName || !clientName || amount == null) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        let financeEntry = await FinanceDetails.findOne({ id });

        if (financeEntry) {
            // Update only the fields that are provided
            financeEntry.dueDate = dueDate || financeEntry.dueDate;
            financeEntry.advancePayment = advancePayment !== undefined ? advancePayment : financeEntry.advancePayment;
            financeEntry.midPayment = midPayment !== undefined ? midPayment : financeEntry.midPayment;
            financeEntry.finalPayment = finalPayment !== undefined ? finalPayment : financeEntry.finalPayment;
            financeEntry.amount = amount;
            financeEntry.balance = amount - (financeEntry.advancePayment + financeEntry.midPayment + financeEntry.finalPayment);

            if (paymentDate) {
                financeEntry.paymentDate.advancedPDate = paymentDate.advancedPDate || financeEntry.paymentDate.advancedPDate;
                financeEntry.paymentDate.midPDate = paymentDate.midPDate || financeEntry.paymentDate.midPDate;
                financeEntry.paymentDate.finalPDate = paymentDate.finalPDate || financeEntry.paymentDate.finalPDate;
            }

            const updatedFinance = await financeEntry.save();
            return res.status(200).json(updatedFinance);
        } else {
            // Create a new entry if none exists
            const newFinance = new FinanceDetails({
                id,
                dealName,
                clientName,
                dueDate,
                advancePayment: advancePayment || 0,
                midPayment: midPayment || 0,
                finalPayment: finalPayment || 0,
                amount,
                balance: amount - ((advancePayment || 0) + (midPayment || 0) + (finalPayment || 0)),
                paymentDate: {
                    advancedPDate: paymentDate?.advancedPDate || null,
                    midPDate: paymentDate?.midPDate || null,
                    finalPDate: paymentDate?.finalPDate || null
                }
            });

            const savedFinance = await newFinance.save();
            return res.status(201).json(savedFinance);
        }
    } catch (error) {
        console.error('Error saving or updating finance details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET route to fetch all finance details
app.get('/api/financeDetails', async (req, res) => {
    try {
        const financeData = await FinanceDetails.find();
        res.status(200).json(financeData);
    } catch (err) {
        console.error("Error fetching finance details:", err);
        res.status(500).json({ message: 'Error fetching finance details' });
    }
});

// Client Schema
const clientSchema = new mongoose.Schema({
    clientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    companyname: { type: String, required: true },
    status: { type: String, required: true },
    dob: { type: Date, required: true },
    city: { type: String, required: true },
    industry: { type: String, required: true },
    note: { type: String },
    created_at: { type: Date, default: Date.now },
});


const Client = mongoose.model("ClientDetail", clientSchema);

// ✅ Fetch All Clients
app.get("/api/clientDetail", async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json({ success: true, clients });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching clients", error: err.message });
    }
});

// ✅ Fetch Client by ID
app.get("/api/clientDetail/:id", async (req, res) => {
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
});




// ✅ Add New Client
app.post("/api/clientDetail", async (req, res) => {
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
});





// ✅ Edit Client
app.put("/api/clientDetail/:id", async (req, res) => {
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
});

// ✅ Delete Client
app.delete("/api/clientDetail/:id", async (req, res) => {
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
});


// Deleted Leads Schema and Model
const DeletedLeadSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Client Name
    leadName: { type: String, required: true }, // Deal Name
    stage: { type: String, required: true },
    amount: { type: Number, default: 0 },
    scheduledMeeting: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: Date.now },
});
const DeleteLeads = mongoose.model("DeleteLeads", DeletedLeadSchema);

// Deal Management Schema and Model
const DealManagementSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Client Name
    leadName: { type: String, required: true }, // Deal Name
    stage: { type: String, required: true },
    amount: { type: Number, default: 0 },
    scheduledMeeting: { type: Date, default: Date.now },
});
const DealManagement = mongoose.model("DealManagement", DealManagementSchema);

// Archive a deal (Move to DeleteLeads collection)
app.post("/api/dealmanagement/archive/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deal = await DealManagement.findById(id);

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        // Check if the deal is in 'Qualified' stage before archiving
        if (deal.stage !== "Qualified") {
            return res.status(400).json({ message: "Only qualified deals can be archived" });
        }

        // Move the deal to DeleteLeads collection
        const archivedLead = new DeleteLeads({
            name: deal.name,
            leadName: deal.leadName,
            amount: deal.amount,
            stage: deal.stage,
            scheduledMeeting: deal.scheduledMeeting,
        });
        await archivedLead.save();

        // Delete the deal from DealManagement
        await DealManagement.findByIdAndDelete(id);

        res.json({ message: "Lead archived successfully", archivedLead });
    } catch (error) {
        res.status(500).json({ message: "Error archiving lead", error });
    }
});

// Fetch archived leads (Recycle Bin)
app.get("/api/recyclebin", async (req, res) => {
    try {
        const archivedLeads = await DeleteLeads.find();
        res.json(archivedLeads);
    } catch (error) {
        res.status(500).json({ message: "Error fetching archived leads", error });
    }
});

app.post("/api/recyclebin/restore/:id", async (req, res) => {
    const { id } = req.params; // Correctly extract the ID from URL params
    try {
        const deal = await DealManagement.findById(id);
        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        deal.stage = "Qualified"; // Restore the stage to "Qualified"
        await deal.save();

        res.json(deal); // Return the updated deal as JSON
    } catch (error) {
        console.error("Restore Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Restore an archived lead
app.post("/api/recyclebin/restore/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const archivedLead = await DeleteLeads.findById(id);

        if (!archivedLead) {
            return res.status(404).json({ message: "Archived lead not found" });
        }

        // Restore the lead to DealManagement collection with 'Qualified' stage
        const restoredLead = new DealManagement({
            name: archivedLead.name,
            leadName: archivedLead.leadName,
            amount: archivedLead.amount,
            stage: "Qualified", // Set stage to Qualified
            scheduledMeeting: archivedLead.scheduledMeeting,
        });
        await restoredLead.save();

        // Remove from DeleteLeads collection
        await DeleteLeads.findByIdAndDelete(id);

        res.json({ message: "Lead restored successfully", restoredLead });
    } catch (error) {
        res.status(500).json({ message: "Error restoring lead", error });
    }
});

// Delete an archived lead permanently
app.delete("/api/recyclebin/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLead = await DeleteLeads.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ message: "Archived lead not found" });
        }

        res.json({ message: "Archived lead deleted permanently", deletedLead });
    } catch (error) {
        res.status(500).json({ message: "Error deleting archived lead", error });
    }
});
// Define Meeting Schema
const meetingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    note: { type: String, required: true },
    keyword: { type: String, required: true }
});

const Meeting = mongoose.model("Meeting", meetingSchema);

// Routes

// Fetch meetings by date
app.get("/api/meetings/:date", async (req, res) => {
    try {
        const meetings = await Meeting.find({ date: req.params.date });
        res.json({ meetings });
    } catch (error) {
        res.status(500).json({ message: "Error fetching meetings", error });
    }
});

// Add a new meeting
app.post("/api/meetings", async (req, res) => {
    try {
        const { date, startTime, endTime, note, keyword } = req.body;
        const newMeeting = new Meeting({ date, startTime, endTime, note, keyword });
        await newMeeting.save();
        res.status(201).json({ message: "Meeting saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving meeting", error });
    }
});

// Update an existing meeting
app.put("/api/meetings/update", async (req, res) => {
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
});

// Delete a meeting
app.delete("/api/meetings/:id", async (req, res) => {
    try {
        const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
        if (!deletedMeeting) return res.status(404).json({ message: "Meeting not found" });
        res.json({ message: "Meeting deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting meeting", error });
    }
});
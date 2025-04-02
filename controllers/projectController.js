
const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new project
exports.createProject = async (req, res) => {
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
};

// Update a project
exports.updateProject = async (req, res) => {
    const { name, userResponsible, dueDate, team, status } = req.body;

    try {
        const updatedProject = await Project.findOneAndUpdate(
            { id: req.params.id },
            {
                name,
                userResponsible,
                dueDate,
                team,
                status
            },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findOneAndDelete({ id: req.params.id });

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

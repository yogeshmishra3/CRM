const ProjectModel = require('../models/projects.model');

exports.getProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        res.status(200).json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch projects', error: error.message });
    }
};

exports.addProject = async (req, res) => {
    const { name, date, team, status } = req.body;
    if (!name || !date || !team || !status) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const project = new ProjectModel({ name, date, team, status });
        await project.save();
        res.status(201).json({ success: true, message: 'Project added', project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding project', error: error.message });
    }
};

// Update and Delete Project Routes

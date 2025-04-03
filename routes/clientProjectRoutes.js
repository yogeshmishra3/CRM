
const express = require('express');
const router = express.Router();
const ClientProject = require('../models/ClientProject');

// GET Route - Fetch All ClientProjects
router.get('/client-projects', async (req, res) => {
    try {
        const projects = await ClientProject.find();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST Route - Save New ClientProject
router.post('/client-projects', async (req, res) => {
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

module.exports = router;

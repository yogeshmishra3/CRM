
const ProjectDetails = require('../models/ProjectDetails');

// Get all project details
exports.getAllProjectDetails = async (req, res) => {
    try {
        const projects = await ProjectDetails.find();
        res.status(200).json(projects);
    } catch (err) {
        console.error("Error fetching project details:", err);
        res.status(500).json({ message: 'Error fetching project details' });
    }
};

// Create or update project details
exports.createOrUpdateProjectDetails = async (req, res) => {
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
            return res.status(200).json(updatedProject);
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
            return res.status(201).json(savedProject);
        }
    } catch (error) {
        console.error('Error saving or updating project:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

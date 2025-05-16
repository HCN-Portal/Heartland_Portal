const mongoose = require('mongoose');
const Project = require('../models/projects');

exports.createProject = async (req, res) => {
    try {
        const { title, description, managerId, startDate, endDate, status, teamMembers, skillTags, client } = req.body;

        // Validate required fields
        if (!title || !description || !startDate || !endDate || !status || !client) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new project
        const newProject = new Project({
            title,
            description,
            //managerId,
            startDate,
            endDate,
            status,
            //teamMembers,
            skillTags,
            client
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
}

exports.getAllProjectTitles = async (req, res) => {
    try {
        // Fetch only the title and _id fields from all projects
        const projects = await Project.find({}, 'title _id');
        
        // Return the simplified project list
        res.status(200).json({
            count: projects.length,
            projects: projects.map(project => ({
                id: project._id,
                title: project.title
            }))
        });
    } catch (error) {
        console.error('Error fetching project titles:', error);
        res.status(500).json({ message: 'Error fetching project titles', error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }
        
        // Find project by ID
        const project = await Project.findById(projectId);
        
        // If no project found, return 404
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Return project data
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
}

exports.updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { title, description, managerId, startDate, endDate, status, teamMembers, skillTags, client } = req.body;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Find and update the project
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { title, description, managerId, startDate, endDate, status, teamMembers, skillTags, client },
            { new: true }
        );

        // If no project found, return 404
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
}

exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Find and delete the project
        const deletedProject = await Project.findByIdAndDelete(projectId);

        // If no project found, return 404
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
}

exports.addEmployeesToProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { employees } = req.body;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Validate employees array
        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({ message: 'Employees array is required and cannot be empty' });
        }

        // Validate each employee object
        for (const employee of employees) {
            if (!mongoose.Types.ObjectId.isValid(employee.employeeId) || !employee.name) {
                return res.status(400).json({ message: 'Each employee must have a valid employeeId and name' });
            }
        }

        // Find the project and update teamMembers
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $push: { teamMembers: { $each: employees } } },
            { new: true }
        );

        // If no project found, return 404
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Employees added to project successfully', employees: updatedProject.teamMembers });
    } catch (error) {
        console.error('Error adding employees to project:', error);
        res.status(500).json({ message: 'Error adding employees to project', error: error.message });
    }
    
}

exports.addManagersToProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { managers } = req.body;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Validate managers array
        if (!Array.isArray(managers) || managers.length === 0) {
            return res.status(400).json({ message: 'Managers array is required and cannot be empty' });
        }

        // Validate each manager object
        for (const manager of managers) {
            if (!mongoose.Types.ObjectId.isValid(manager.managerId) || !manager.name) {
                return res.status(400).json({ message: 'Each manager must have a valid managerId and name' });
            }
        }

        // Find the project and update managers
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $push: { managers: { $each: managers } } },
            { new: true }
        );

        // If no project found, return 404
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Managers added to project successfully', managers: updatedProject.managers });
    } catch (error) {
        console.error('Error adding managers to project:', error);
        res.status(500).json({ message: 'Error adding managers to project', error: error.message });
    }
}

// Remove an employee from a project
exports.removeEmployeeFromProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const employeeId = req.params.employeeId;
        console.log("Project ID:", projectId);
        console.log("Employee ID:", employeeId);

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Validate if employeeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID format' });
        }

        // Find the project first
        const project = await Project.findById(projectId);
        
        // If no project found, return 404
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Check if employee exists in the team members array
        const employeeExists = project.teamMembers.some(member => 
            member.employeeId.toString() === employeeId
        );
        
        if (!employeeExists) {
            return res.status(404).json({ 
                message: 'Employee not found in the project team' 
            });
        }

        // Find the project and remove the employee from teamMembers
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $pull: { teamMembers: { employeeId: employeeId } } },
            { new: true }
        );

        // If no project found, return 404
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ 
            message: 'Employee removed from project successfully', 
            teamMembers: updatedProject.teamMembers 
        });
    } catch (error) {
        console.error('Error removing employee from project:', error);
        res.status(500).json({ 
            message: 'Error removing employee from project', 
            error: error.message 
        });
    }
};

// Remove a manager from a project
exports.removeManagerFromProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const managerId = req.params.managerId;
        console.log("Project ID:", projectId);
        console.log("Manager ID:", managerId);

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Validate if managerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(managerId)) {
            return res.status(400).json({ message: 'Invalid manager ID format' });
        }

        // Find the project first
        const project = await Project.findById(projectId);
        
        // If no project found, return 404
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Check if manager exists in the managers array
        const managerExists = project.managers.some(manager => 
            manager.managerId.toString() === managerId
        );
        
        if (!managerExists) {
            return res.status(404).json({ 
                message: 'Manager not found in the project' 
            });
        }

        // Find the project and remove the manager from managers array
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $pull: { managers: { managerId: managerId } } },
            { new: true }
        );

        // If no project found, return 404
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ 
            message: 'Manager removed from project successfully', 
            managers: updatedProject.managers 
        });
    } catch (error) {
        console.error('Error removing manager from project:', error);
        res.status(500).json({ 
            message: 'Error removing manager from project', 
            error: error.message 
        });
    }
};
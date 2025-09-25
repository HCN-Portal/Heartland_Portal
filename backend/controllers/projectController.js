const mongoose = require('mongoose');
const Project = require('../models/projects');
const ProjectApplication = require('../models/projectApplications');
const User = require('../models/user');

exports.createProject = async (req, res) => {
    try {
        const { title, description, startDate, endDate, status,managers, teamMembers, skillTags, client } = req.body;

        // Validate required fields
        if (!title || !description || !startDate || !endDate || !status || !client) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new project
        const newProject = new Project({
            title,
            description,
            startDate,
            endDate,
            status,
            managers: managers || [],
            teamMembers: teamMembers || [],
            skillTags,
            client
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
}

//Add manager name and status to be returned
exports.getAllProjectTitles = async (req, res) => {
    try {
        // Fetch only the title and _id fields from all projects
        const projects = await Project.find();
        
        // Return the simplified project list
        res.status(200).json({
            // count: projects.length,
            // projects: projects.map(project => ({
            //     id: project._id,
            //     title: project.title
            // }))
            projects:projects
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
        // const { title, description, managerId, startDate, endDate, status, teamMembers, skillTags, client } = req.body;
        const updatedData = req.body;
        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Find and update the project
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updatedData,
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

        // Add dateAdded to each employee before pushing
        const employeesWithDate = employees.map(employee => ({
            ...employee,
            dateAdded: new Date()
        }));

        // Find the project and update teamMembers
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $push: { teamMembers: { $each: employeesWithDate } } },
            { new: true }
        );

        // If no project found, return 404
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Add project for each employee in Users table.
        const project  = await Project.findById(projectId).select('title');
        const projectEntry = {
            projectId: project._id,
            title: project.title
        };
        // console.log(projectEntry)
        const validEmployees = employees.filter(e => mongoose.Types.ObjectId.isValid(e.employeeId));
        const addOps = validEmployees.map(e => ({
            updateOne: {
                filter: {
                    _id: e.employeeId,
                    'projectsAssigned.projectId': { $ne: projectId }
                },
                update: {
                    $addToSet: {
                        projectsAssigned: {
                            projectId: projectEntry.projectId,
                            title: projectEntry.title
                        }
                    }
                }
            }
        }));

        if (addOps.length) await User.bulkWrite(addOps);



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

        // Add dateAdded to each manager before pushing
        const managersWithDate = managers.map(manager => ({
            ...manager,
            dateAdded: new Date()
        }));

        // Find the project and update managers
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $push: { managers: { $each: managersWithDate } } },
            { new: true }
        );

        // If no project found, return 404
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }


        // Add project for each manager in users table.
        const project = await Project.findById(projectId).select('title');
        const projectEntry = {
            projectId: project._id,
            title: project.title
        };
        // console.log(projectEntry)
        const validManagers = managers.filter(e => mongoose.Types.ObjectId.isValid(e.managerId));
        const addOps = validManagers.map(e => ({
            updateOne: {
                filter: {
                    _id: e.managerId,
                    'projectsAssigned.projectId': { $ne: projectId }
                },
                update: {
                    $addToSet: {
                        projectsAssigned: {
                            projectId: projectEntry.projectId,
                            title: projectEntry.title
                        }
                    }
                }
            }
        }));
        if (addOps.length) await User.bulkWrite(addOps); 

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

       
            await User.updateOne(
                { _id: employeeId },
                {
                    $pull: {
                        projectsAssigned: {
                            projectId: projectId 
                        }
                    }
                }
            );


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

        await User.updateOne(
                { _id: managerId },
                {
                    $pull: {
                        projectsAssigned: {
                            projectId: projectId 
                        }
                    }
                }
            );

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

exports.applyToManageProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { employeeId, requestDetails } = req.body;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is already a manager of this project
        const isAlreadyManager = project.managers.some(manager => 
            manager.managerId.toString() === managerId.toString()
        );
        
        if (isAlreadyManager) {
            return res.status(400).json({ 
                message: 'You are already a manager for this project' 
            });
        }

        // Check if there's already a pending request
        const existingRequest = await ProjectApplication.findOne({
            projectId,
            employeeId,
            role: 'manager',
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ 
                message: 'You already have a pending request for this project' 
            });
        }

        // Create the project request
        const newRequest = new ProjectApplication({
            employeeId,
            projectId,
            requestDetails: requestDetails || 'Request to manage this project',
            role: 'manager'
        });

        await newRequest.save();

        res.status(201).json({ 
            message: 'Application to manage project submitted successfully',
            request: {
                id: newRequest._id,
                projectId: newRequest.projectId,
                status: newRequest.status,
                requestDate: newRequest.requestDate
            }
        });
    } catch (error) {
        console.error('Error applying to manage project:', error);
        res.status(500).json({ 
            message: 'Error submitting management application', 
            error: error.message 
        });
    }
};

exports.getProjectApplications = async (req, res) => {
    try {
        
        const requests = await ProjectApplication.find()
            .populate('employeeId', 'firstName lastName email role')
            .populate('projectId', 'title client')
            .sort({ requestDate: -1 }); // Sort by most recent first

        res.status(200).json({
            message: 'All project requests retrieved successfully',
            count: requests.length,
            requests: requests
        });
    } catch (error) {
        console.error('Error fetching all project requests:', error);
        res.status(500).json({
            message: 'Error fetching all project requests',
            error: error.message
        });
    }
    
};

exports.getProjectApplicationsById = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        const requests = await ProjectApplication.find({ projectId })
            .populate('employeeId', 'firstName lastName email role')
            .populate('projectId', 'title client')
            .sort({ requestDate: -1 }); // Sort by most recent first

        if (requests.length === 0) {
            return res.status(404).json({ message: 'No requests found for this project' });
        }

        res.status(200).json({
            message: `Requests for project ${projectId} retrieved successfully`,
            count: requests.length,
            requests: requests
        });
    } catch (error) {
        console.error('Error fetching project requests by ID:', error);
        res.status(500).json({
            message: 'Error fetching project requests by ID',
            error: error.message
        });
    }
}

exports.getProjectApplicationsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const requests = await ProjectApplication.find({ employeeId: userId })
            .populate('employeeId', 'firstName lastName email role')
            .populate('projectId', 'title client managers.name managers.email startDate')
            .sort({ requestDate: -1 }); // Sort by most recent first

        if (requests.length === 0) {
            return res.status(404).json({ message: 'No requests found for this user' });
        }

        res.status(200).json({
            message: `Requests for user ${userId} retrieved successfully`,
            count: requests.length,
            requests: requests
        });
    } catch (error) {
        console.error('Error fetching project requests by user ID:', error);
        res.status(500).json({
            message: 'Error fetching project requests by user ID',
            error: error.message
        });
    }
}

exports.applyToJoinProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { employeeId, requestDetails } = req.body;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is already a team member of this project
        const isAlreadyEmployee = project.teamMembers.some(member => 
            member.employeeId.toString() === employeeId.toString()
        );
        
        if (isAlreadyEmployee) {
            return res.status(400).json({ 
                message: 'You are already a team member for this project' 
            });
        }

        // Check if user is already a manager of this project
        const isAlreadyManager = project.managers.some(manager => 
            manager.managerId.toString() === employeeId.toString()
        );
        
        if (isAlreadyManager) {
            return res.status(400).json({ 
                message: 'You are already a manager for this project' 
            });
        }

        // Check if there's already a pending request
        const existingRequest = await ProjectApplication.findOne({
            projectId,
            employeeId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ 
                message: 'You already have a pending request for this project' 
            });
        }

        // Create the project request
        const newRequest = new ProjectApplication({
            employeeId,
            projectId,
            requestDetails: requestDetails || 'Request to join this project as an employee',
            role: 'employee'
        });

        await newRequest.save();

        res.status(201).json({ 
            message: 'Application to join project submitted successfully',
            request: {
                id: newRequest._id,
                projectId: newRequest.projectId,
                status: newRequest.status,
                requestDate: newRequest.requestDate,
                role: newRequest.role
            }
        });
    } catch (error) {
        console.error('Error applying to join project:', error);
        res.status(500).json({ 
            message: 'Error submitting application to join project', 
            error: error.message 
        });
    }
};

exports.approveProjectApplication = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const applicationId = req.params.applicationId;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Validate if applicationId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID format' });
        }

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the application
        const application = await ProjectApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if application belongs to the specified project
        if (application.projectId.toString() !== projectId) {
            return res.status(400).json({ 
                message: 'Application does not belong to the specified project' 
            });
        }

        // Check if application is already processed
        if (application.status !== 'pending') {
            return res.status(400).json({ 
                message: `Application has already been ${application.status}` 
            });
        }

        // Update application status to approved
        application.status = 'approved';
        application.responseDate = new Date();
        await application.save();
        
        // Add user to the project based on their role
        if (application.role === 'employee') {
            // Get user details
            const user = await User.findById(application.employeeId);
            if (!user) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            
            // Check if employee is already in the team
            const isAlreadyMember = project.teamMembers.some(
                member => member.employeeId.toString() === user._id.toString()
            );
            
            if (!isAlreadyMember) {
                // Add user to team members
                project.teamMembers.push({
                    employeeId: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email : user.email,
                    dateAdded: new Date()
                });
                
                // Also add the project to the user's projectsAssigned list
                user.projectsAssigned.push({
                    projectId: project._id,
                    title: project.title
                });

                await project.save();
                await user.save();
            }
        } else if (application.role === 'manager') {
            // Get user details
            const user = await User.findById(application.employeeId);
            if (!user) {
                return res.status(404).json({ message: 'Manager not found' });
            }
            
            // Check if manager is already in the managers list
            const isAlreadyManager = project.managers.some(
                manager => manager.managerId.toString() === user._id.toString()
            );
            
            if (!isAlreadyManager) {
                // Add user to managers
                project.managers.push({
                    managerId: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email : user.email,
                    dateAdded: new Date()
                });

                // Also add the project to the user's projectsAssigned list
                user.projectsAssigned.push({
                    projectId: project._id,
                    title: project.title
                });
                
                await project.save();
                await user.save();
            }
        }

        res.status(200).json({
            message: `Application approved successfully, ${application.role} added to project`,
            application: {
                id: application._id,
                status: application.status,
                responseDate: application.responseDate,
                role: application.role
            },
            project: {
                id: project._id,
                title: project.title,
                teamMembers: application.role === 'employee' ? project.teamMembers : undefined,
                managers: application.role === 'manager' ? project.managers : undefined
            }
        });
    } catch (error) {
        console.error('Error approving project application:', error);
        res.status(500).json({
            message: 'Error approving project application',
            error: error.message
        });
    }
};

exports.declineProjectApplication = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const applicationId = req.params.applicationId;
        const { responseNotes } = req.body;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Validate if applicationId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID format' });
        }

        // Find the project (to verify it exists)
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the application
        const application = await ProjectApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if application belongs to the specified project
        if (application.projectId.toString() !== projectId) {
            return res.status(400).json({ 
                message: 'Application does not belong to the specified project' 
            });
        }

        // Check if application is already processed
        if (application.status !== 'pending') {
            return res.status(400).json({ 
                message: `Application has already been ${application.status}` 
            });
        }

        // Update application status to declined
        application.status = 'declined';
        application.responseDate = new Date();
        await application.save();

        res.status(200).json({
            message: 'Application declined successfully',
            application: {
                id: application._id,
                status: application.status,
                responseDate: application.responseDate,
                role: application.role,
                responseNotes: application.responseNotes
            }
        });
    } catch (error) {
        console.error('Error declining project application:', error);
        res.status(500).json({
            message: 'Error declining project application',
            error: error.message
        });
    }
};



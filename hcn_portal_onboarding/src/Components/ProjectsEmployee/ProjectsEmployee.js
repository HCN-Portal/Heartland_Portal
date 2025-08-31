import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProjectById, get_all_projects } from "../../store/reducers/projectReducer";
import { get_user_by_id, get_all_managers } from "../../store/reducers/userReducer";
import "../Projects/Projects.css";
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import Sidebar from "../Sidebar/Sidebar";


const ProjectsEmployee = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Managers", "Employees"];
    const [projectView, setProjectView] = useState("My Projects");
    const [myProjects, setMyProjects] = useState([]);

    const { selectedUser } = useSelector(state => state.user);
    const { projects } = useSelector(state => state.project);
    const { managers: managersList } = useSelector(state => state.user); // Rename to managersList for clarity
    const authState = useSelector(state => state.auth);

    useEffect(() => {
        // Get user info from Redux or localStorage
        const userInfo = authState.userInfo || JSON.parse(localStorage.getItem('userInfo'));
        console.log('User Info:', userInfo); // Debug log
        if (userInfo?.userId) {
            dispatch(get_user_by_id(userInfo.userId));
            dispatch(get_all_projects()); // Fetch all projects when component mounts
            dispatch(get_all_managers()); // Fetch all managers
        }
        console.log('Managers',managersList);
    }, [dispatch, authState.userInfo]);

    useEffect(() => {
        console.log('Selected User:', selectedUser); // Debug log
        if (selectedUser?.projectsAssigned && Array.isArray(selectedUser.projectsAssigned)) {
            console.log('Projects Assigned:', selectedUser.projectsAssigned); // Debug log
            selectedUser.projectsAssigned.forEach(projectId => {
                const project = projects.find(p => p._id === projectId);
                if (!project) {
                    dispatch(getProjectById(projectId));
                }
            });
        }
    }, [selectedUser, dispatch, projects]);

    useEffect(() => {
        console.log('Projects from Redux:', projects); // Debug log
        if (selectedUser?.projectsAssigned && projects?.length > 0) {
            const assignedProjects = selectedUser.projectsAssigned
                .map(assignedProject => {
                    const projectId = assignedProject.projectId;
                    const project = projects.find(p => p._id === projectId);
                    console.log('Found project for ID:', projectId, project); // Debug log
                    if (project) {
                        return {
                            id: project._id,
                            title: project.title || project.projectName,
                            startDate: new Date(project.startDate).toLocaleDateString(),
                            endDate: new Date(project.endDate).toLocaleDateString(),
                            status: project.status,
                            description: project.description,
                            managers: project.managers?.map(m => {
                                // Use managers array directly from state
                                const managerDetails = Array.isArray(managersList)
                                    ? managersList.find(manager => manager.id === m.managerId)
                                    : null;
                                return {
                                    name: m.name,
                                    email: managerDetails?.email || 'Email not available',
                                    id: m.managerId
                                };
                            }) || [],
                            teamMembers: project.teamMembers?.map(t => ({
                                name: t.name,
                                position: t.position || t.role || 'Team Member',
                                date: t.joinDate ? new Date(t.joinDate).toLocaleDateString() : ''
                            })) || [],
                            client: project.client || 'N/A',
                            skillTags: project.skillTags || []
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            console.log('Processed assigned projects:', assignedProjects); // Debug log
            setMyProjects(assignedProjects);
            setProjectsToDisplay(assignedProjects);
        }
    }, [selectedUser, projects, managersList]); // Updated dependency to managersList

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;


    const [allProjects, setallProjects] = useState([
        {
            id: 3,
            title: 'HCN Portal 1 ALL',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com', id:14321 }
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        },
        {
            id: 4,
            title: 'HCN Portal 2 ALL',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com' , id:14321}
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        },
        {
            id: 567,
            title: 'HCN Portal 3 REQ',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com' , id:14321}
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        },
        {
            id: 876,
            title: 'HCN Portal 2 REQ',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com' , id:14321}
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        },
        {
            id: 1,
            title: 'Project HCN',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com', id:14321 }
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            applications: [
            { name: 'ManagerX', position: 'Manager' },
            { name: 'EmployeeY', position: 'Employee' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        },
        {
            id: 2,
            title: 'Food Store Project',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com' , id:14321}
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            applications: [
            { name: 'ManagerX', position: 'Manager' },
            { name: 'EmployeeY', position: 'Employee' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        }

    ]);

    const [requestedProjects, setRequestedProjects] = useState([
        {
            id: 567,
            title: 'HCN Portal 1 REQ',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com', id:14321 }
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        },
        {
            id: 876,
            title: 'HCN Portal 2 REQ',
            manager: 'Dhanush',
            start: '04/08/2025',
            end: '04/23/2026',
            status: 'Active',
            description:
            'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
            managers: [
            { name: 'Dhanush', email: 'dhanush@admin.hcn.com' , id:14321}
            ],
            teamMembers: [
            { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
            { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
            ],
            client: 'HCN',
            skillTags: ['ReactJS', 'MongoDB', 'Hosting', 'NodeJS', 'ExpressJS']
        }

    ]);


    const [projectsToDisplay, setProjectsToDisplay] = useState(myProjects);

    const totalPages = Math.ceil(projectsToDisplay.length / projectsPerPage);
    const currentProjects = projectsToDisplay.slice(indexOfFirstProject, indexOfLastProject);

    // console.log(selectedProject)
    const handleEachProject = (projectId) => {
        // dispatch(getProjectById(projectId));
        setSelectedProject(projectId);
        
    }
    const handleProjectViewChange = (view) => {
        setProjectView(view);

        if (view === "Requested Projects") {
            setProjectsToDisplay(requestedProjects);
        }
        else if(view === "All Projects"){
            setProjectsToDisplay(allProjects);
        }
        else {
            setProjectsToDisplay(myProjects);
        }
    };

    const handleRequest = () => {
        alert("Request has been sent successfully!");
        // Add actual request logic here later
    };

    const getProjectStatus = (projectId) => {
        if (myProjects.some((p) => p.id === projectId)) {
            return "Joined";
        }
        if (requestedProjects.some((p) => p.id === projectId)) {
            return "Requested";
        }
        return "Available";
    };

    const renderDetail = () => (
        <div className="project-modal">
            <div className="dashboard-header">
                <button className="close-btn"
                          onClick={() => {
                            setSelectedProject(null)
                          }}
                        >
                          Close
                </button>
                {projectView === "All Projects" && (  // show only when allProjects is loaded
                    <button
                        className="close-btn"
                        onClick={handleRequest}
                        >
                        Send Request
                    </button>
                )}
                {projectView === "Requested Projects" && (
                        <h3 color="Green"> Requested! </h3>
                )}
            </div>

            <div className="project-tabs">
                {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`tab-button ${activeTab === tab ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
                ))}
            </div>

            <div className="project-content">
                {activeTab === 'Overview' && (
                    <div className="project-modal">
                        <h3 className='show-label-h3'> Project Details </h3>
                        <div className="project-detail-row">
                            <div className="project-label"><strong>Project Name:</strong></div>
                            <div className="project-value"> {selectedProject.title} </div>
                        </div>
                        <div className="project-detail-row">
                            <div className="project-label"><strong>Description</strong></div>
                            <div className="project-value"> {selectedProject.description} </div>
                        </div>
                        <div className="project-detail-row">
                            <div className="project-label"><strong>Start Date - End Date:</strong></div>
                            {/*  We need to change the date to display correctly */}
                            <div className="project-value"> {`${selectedProject.startDate} - ${selectedProject.endDate ?? "Ongoing"}`} </div>
                        </div>    
                        <div className="project-detail-row">
                            <div className="project-label"><strong>Skill Tags:</strong></div>
                            <div className="project-value"> {selectedProject.skillTags?.join(', ') || ''} </div>
                        </div>
                        <div className="project-detail-row">
                            <div className="project-label"><strong>Client Name:</strong></div>
                            <div className="project-value"> {selectedProject.client} </div>
                        </div>
                    </div>
                )}
                {activeTab === "Managers" && (
                    <div className="project-modal fade-in">
                        <h3 className="show-label-h3">Manager Details</h3>
                        {(selectedProject.managers || []).map((m, i) => (
                            <div key={i} className="manager-card">
                                <div className="manager-info">
                                    <p className="manager-label">Manager {i + 1}</p>
                                    <div className="manager-field">
                                        <strong>Name:</strong> <span>{m.name}</span>
                                    </div>
                                    <div className="manager-field">
                                        <strong>Email:</strong> <span>{m.email}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

            
                )}

                {activeTab === "Employees" && (
                    <div className="project-modal fade-in">
                        <h3 className="show-label-h3">Employees Details</h3>
                        <table className="applicant-table">
                            <thead>
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(selectedProject?.teamMembers || []).map((e, i) => (
                                    <tr key={i}>
                                        <td>{e.name}</td>
                                        <td>{e.position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


            </div>
        </div>
    )

    

    return(
        
        <div>
            <NavigationBar isLoggedIn="true" />
            <div className="admin-dashboard">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <main className="pending-main">
                
                {!selectedProject ? (
                    <>
                    <div className="dashboard-header">
                        <h2 className="pending-title">{projectView}</h2>
                        
                        <div className="project-tabs">
                        {["My Projects", "Requested Projects", "All Projects"].map((view) => (
                            <button
                            key={view}
                            className={`tab-button ${projectView === view ? 'active-tab' : ''}`}
                            onClick={() => handleProjectViewChange(view)}
                            >
                            {view}
                            </button>
                        ))}
                    </div>
                    </div>
                    <table className="applicant-table">
                        <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Manager Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentProjects.map((project, index) => (
                            <>
                            <tr key={index}>
                            <td>
                                {index + 1}. {project.title}
                            </td>
                            <td>{project.managers[0] ? project.managers[0].name : "None"}</td>
                            <td>{project.startDate}</td>
                            <td>{project.endDate ? project.endDate : "Ongoing"}</td>
                            <td>{project.status}</td>
                            {/* <td>
                                <button
                                className="view-btn"
                                onClick={() => {
                                    // console.log(project)
                                    // handleEachProject(project)
                                    setSelectedProject(project);
                                    setActiveTab("Overview");
                                }}
                                >
                                View Project
                                </button>
                            </td> */}
                            <td>
                                {projectView === "All Projects" ? (
                                    <>
                                    {getProjectStatus(project.id) === "Available" ? (
                                        <button
                                        className="view-btn"
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setActiveTab("Overview");
                                        }}
                                        >
                                        View Project
                                        </button>
                                    ) : (
                                        <div className={`status-label ${getProjectStatus(project.id).toLowerCase()}`}>
                                        <span
                                        // className={`status-label ${getProjectStatus(project.id).toLowerCase()}`}
                                        >
                                        {getProjectStatus(project.id)}
                                        </span>
                                        </div>
                                    )}
                                    </>
                                ) : (
                                    <button
                                    className="view-btn"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setActiveTab("Overview");
                                    }}
                                    >
                                    View Project
                                    </button>
                                )}
                                </td>

                            </tr>
                            </>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination-controls">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="page-btn"
                        >
                        Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="page-btn"
                        >
                        Next
                        </button>
                    </div>
                    </>
                    ):(
                        <>
                        <hr />
                        <h2>Selected Project Details</h2>
                        {renderDetail()}
                        </>
                    )
                }

            </main>
            </div>
        </div>
    );

}

export default ProjectsEmployee;


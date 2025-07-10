import React, { useState } from 'react';
import './Projects.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

const Projects = () => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [newManager, setNewManager] = useState({ name: '', email: '' });
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });

  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    manager: 'Not Assigned',
    start: '',
    end: 'N/A',
    status: 'Active'
  });

  const [projects, setProjects] = useState([
  {
    id: 1,
    name: 'HCN Portal',
    manager: 'Dhanush',
    start: '04/08/2025',
    end: '04/23/2026',
    status: 'Active',
    description:
      'The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.',
    managers: [
      { name: 'Dhanush', email: 'dhanush@admin.hcn.com' }
    ],
    employees: [
      { name: 'Harshitha', position: 'Developer', date: '04/08/2025' },
      { name: 'Likhitha', position: 'Developer', date: '04/08/2025' },
      { name: 'Preeth', position: 'Developer', date: '04/08/2025' }
    ],
    applications: [
      { name: 'ManagerX', position: 'Manager' },
      { name: 'EmployeeY', position: 'Employee' }
    ]
  }
  ]);

  const managerStaticData = {
   name: 'Dhanush', 
   email: 'dhanush@admin.hcn.com',
  role: 'Manager',
  department: 'Project Management',
  projectCount: 2,
  joiningDate: '01/15/2023'
};

const [selectedEmployee, setSelectedEmployee] = useState(null);
const [selectedManagerDetails, setselectedManagerDetails] = useState(null);

  // const tabs = ['Overview', 'Managers', 'Employees', 'Applications', 'Updates/Activity'];
  const tabs = ['Overview', 'Managers', 'Employees'];

  // Handlers

  // const formatDateForInput = (dateString) => {
  //   const [month, day, year] = dateString.split('/');
  //   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  // };
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    if (dateString.includes('/')) {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (dateString.includes('-')) {
      return dateString;  // already in correct format
    }
    
    return '';
  };


  const formatDateToDisplay = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  const handleAddManager = () => { 
  /* add manager logic */ 
    const updatedManagers = [...selectedProject.managers, { ...newManager }];
    const updatedProject = { ...selectedProject, managers: updatedManagers };
    setSelectedProject(updatedProject);
    setProjects(prev =>
      prev.map(p => (p.id === selectedProject.id ? updatedProject : p))
    );
    setNewManager({ name: '', email: '' });
  };

  // const handleUpdateManager = (index, field, value) => { /* update manager logic */ 
  //   const updatedManagers = [...selectedProject.managers];
  //   updatedManagers[index][field] = value;
  //   const updatedProject = { ...selectedProject, managers: updatedManagers };
  //   setSelectedProject(updatedProject);
  //   setProjects(prev =>
  //     prev.map(p => (p.id === selectedProject.id ? updatedProject : p))
  //   );
  // };

  const handleRemoveManager = (index) => { /* remove manager logic */ 
    const updatedManagers = selectedProject.managers.filter((_, i) => i !== index);
    const updatedProject = { ...selectedProject, managers: updatedManagers };
    setSelectedProject(updatedProject);
    setProjects(prev =>
      prev.map(p => (p.id === selectedProject.id ? updatedProject : p))
    );
  };


  const ProfileModal = ({ data, onClose, title }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <table className="profile-table">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="profile-label">{key}</td>
              <td className="profile-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="action-buttons">
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
  );

  const handleSaveNewProject = () => {

    const projectToAdd = {
      id: projects.length + 1,
      name: newProject.name,
      manager: newProject.manager,
      start: newProject.start,
      end: newProject.end,
      status: newProject.status,
      description: '',
      managers: [],
      employees: [],
      applications: []
    };
  setProjects([...projects, projectToAdd]);
  setShowCreateProjectModal(false);
  setNewProject({ name: '', manager: 'Not Assigned', start: '', end: '', status: 'Active' });
  };



  // const handleApproveApplication = (index) => { /* approve application logic */ 
  //   const application = selectedProject.applications[index];
  //   let updatedProject = { ...selectedProject };
  
  //   if (application.position === 'Manager') {
  //     updatedProject.managers = [...updatedProject.managers, { name: application.name, email: `${application.name.toLowerCase()}@admin.hcn.com` }];
  //   } else if (application.position === 'Employee') {
  //     updatedProject.employees = [
  //       ...updatedProject.employees,
  //       {
  //         name: application.name,
  //         position: 'Developer',
  //         date: selectedProject.start
  //       }
  //     ];
  //   }
  
  //   updatedProject.applications = selectedProject.applications.filter((_, i) => i !== index);
  //   setSelectedProject(updatedProject);
  //   setProjects(prev =>
  //     prev.map(p => (p.id === selectedProject.id ? updatedProject : p))
  //   );
  // };

  // const handleRejectApplication = (index) => { /* reject application logic */ 
  //   const updatedApplications = selectedProject.applications.filter((_, i) => i !== index);
  //   const updatedProject = { ...selectedProject, applications: updatedApplications };
  
  //   setSelectedProject(updatedProject);
  //   setProjects(prev =>
  //     prev.map(p => (p.id === selectedProject.id ? updatedProject : p))
  //   );
  // };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) return;
    const todayISO = new Date().toISOString().split('T')[0];
    const formattedDate = formatDateToDisplay(todayISO);
    const newEmp = {
      name: newEmployee.name,
      position: newEmployee.position,
      date: formattedDate,
    };
    const updated = {
      ...selectedProject,
      employees: [...selectedProject.employees, newEmp],
    };
    setSelectedProject(updated);
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setNewEmployee({ name: '', position: '' });
  };

  const handleRemoveEmployee = (index) => {
  const updatedEmployees = selectedProject.employees.filter((_, i) => i !== index);
  const updatedProject = { ...selectedProject, employees: updatedEmployees };
  setSelectedProject(updatedProject);
  setProjects(prev =>
    prev.map(p => (p.id === selectedProject.id ? updatedProject : p))
  );
  };

  // Render Tabs Content
  
  console.log(projects)

  const renderDetail = () => (
  <div className="project-modal">
    <div className="dashboard-header">
      <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Project Details: {selectedProject.id}. {selectedProject.name}
      </h2>
      <button className="close-btn" onClick={() => setSelectedProject(null)}>
        Close
      </button>
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
          <h3 className='show-label-h3'>
            Project Details : {selectedProject.name}
          </h3>

          {/* <div className="project-detail-row">
            <div className="project-label"><strong>Project Name:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <input
                  value={editedProject.name}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, name: e.target.value })
                  }
                />
              ) : (
                selectedProject.name
              )}
            </div>
          </div> */}

          <div className="project-detail-row">
            <div className="project-label"><strong>Description:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <textarea
                  rows={6}
                  value={editedProject.description}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, description: e.target.value })
                  }
                />
              ) : (
                selectedProject.description
              )}
            </div>
          </div>

          <div className="project-detail-row">
            <div className="project-label"><strong>Start Date - End Date:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <>
                  <input
                    type="date"
                    value={formatDateForInput(editedProject.start)}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        start: formatDateToDisplay(e.target.value)
                      })
                    }
                  />{' '}
                  -{' '}
                  <input
                    type="date"
                    value={formatDateForInput(editedProject.end)}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        end: formatDateToDisplay(e.target.value)
                      })
                    }
                  />
                </>
              ) : (
                `${selectedProject.start} - ${selectedProject.end}`
              )}
            </div>
          </div>

          <div className="project-detail-row">
            <div className="project-label"><strong>Status:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <select
                  value={editedProject.status}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Onhold">On Hold</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : (
                selectedProject.status
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              className="edit-btn"
              onClick={() => {
                if (isEditingOverview) {
                  setSelectedProject(editedProject);
                  setProjects((prev) =>
                    prev.map((p) => (p.id === editedProject.id ? editedProject : p))
                  );
                } else {
                  setEditedProject({ ...selectedProject });
                }
                setIsEditingOverview(!isEditingOverview);
              }}
            >
              {isEditingOverview ? 'Save' : 'Edit Details'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Managers' && (
        <div className="project-modal fade-in">
          <h3 className='show-label-h3'>
            Manager Details
          </h3>

          {selectedProject.managers.map((m, i) => (
            <div key={i} className="manager-card">
              <div className="manager-info">
                <p className="manager-label">Manager {i + 1}</p>
                <div className="manager-field">
                  <strong>Name:</strong>{' '}
                  <span>{m.name}</span>
                </div>
                <div className="manager-field">
                  <strong>Email Id:</strong>{' '}
                  <span>{m.email}</span>
                </div>
              </div>
              <div className="manager-actions">
                <button
                className="view-btn"
                onClick={() =>
                  setselectedManagerDetails({
                    ...managerStaticData
                  })
                }
                >
                View Profile
                </button>
                <button className="remove-btn" onClick={() => handleRemoveManager(i)}>
                  Remove Manager
                </button>
              </div>
            </div>
          ))}

          {selectedManagerDetails && (
          <ProfileModal
          data={selectedManagerDetails}
          onClose={() => setselectedManagerDetails(null)}
          title="Profile Details"
          />
          )}


          <div className="manager-card">
            <p className="manager-label">Add Manager:</p>
            <div className="add-manager-row">
              <input
                placeholder="Name"
                value={newManager.name}
                onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
              />
              <input
                placeholder="Email"
                value={newManager.email}
                onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
              />
              <button className="edit-btn" onClick={handleAddManager}>
                Add Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Employees' && (
        <div className="project-modal fade-in">
          <h3 className='show-label-h3'>
            Employees Details
          </h3>
          <table className="applicant-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Date Assigned</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedProject.employees.map((e, i) => (
                <tr key={i}>
                  <td>{i + 1}. {e.name}</td>
                  <td>{e.position}</td>
                  <td>{e.date}</td>
                  <td>
                    <button
                    className="view-btn"
                    onClick={() => setSelectedEmployee({
                      name: e.name,
                      position: e.position,
                      date: e.date
                    })}
>
                    View Profile
                    </button>
                    <button className="remove-btn" onClick={() => handleRemoveEmployee(i)}>
                    Remove
                    </button>
                  </td>
                </tr>
              ))}

              
            </tbody>
          </table>
          
          {selectedEmployee && (
          <ProfileModal
            data={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            title="Profile Details"
          />
        )}

          <div className="add-employee-form">
            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            />
            <button className="edit-btn" onClick={handleAddEmployee}>Add Employee</button>
          </div>
        </div>
      )}

      {/* {activeTab === 'Applications' && (
        <div className="project-modal fade-in">
          <h3 className="section-title">Pending Applications</h3>

          {selectedProject.applications.map((app, i) => (
            <div key={i} className="application-card">
              <div className="application-info">
                <p className="applicant-label">{app.name} - {app.position}</p>
              </div>
              <div className="application-actions">
                <button className="view-btn">View Profile</button>
                <button className="approve-btn" onClick={() => handleApproveApplication(i)}>Approve</button>
                <button className="reject-btn" onClick={() => handleRejectApplication(i)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )} */}

      {/* {activeTab === 'Updates/Activity' && <p>No activity yet.</p>} */}
    </div>
  </div>
);

  return (
    <div>
      <NavigationBar isLoggedIn="true" />
      <div className="admin-dashboard">
        <button
          className="toggle-sidebar-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {sidebarOpen ? (
          <aside className="sidebar">
            <div className="sidebar-header">
              <button
                className="toggle-sidebar-btn-inside"
                onClick={() => setSidebarOpen(false)}
              >
                &#9776;
              </button>
              <h2 className="sidebar-title">Heartland Community Network</h2>
            </div>
            <nav className="sidebar-nav">
              <ul>
                <li><a href="/admin/home">Home / Dashboard</a></li>
                <li><a href="/admin/pending">Pending Applications</a></li>
                <li><a href="/admin/employees">Active Employees</a></li>
                <li><a href="/admin/projects" style={{ fontWeight: '900' }}>Projects</a></li>
              </ul>
            </nav>
          </aside>
        ) : (
          <div className="collapsed-sidebar">
            <div className="collapsed-top">
              <button
                className="toggle-sidebar-btn-collapsed"
                onClick={() => setSidebarOpen(true)}
              >
                &#9776;
              </button>
            </div>
          </div>
        )}

        <main className="pending-main">
          {!selectedProject ? (
            <>
              {/* <h2 className="pending-title">Admin Dashboard - Projects</h2>
              <button className="edit-btn" onClick={() => setShowCreateProjectModal(true)}>
              + Create Project
            </button> */}

            <div className="dashboard-header">
              <h2 className="pending-title">Admin Dashboard - Projects</h2>
              <button className="create-project-btn" onClick={() => setShowCreateProjectModal(true)}>
                + Create Project
              </button>
            </div>

            {showCreateProjectModal && (
              <div className="modal-backdrop" onClick={() => setShowCreateProjectModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3 className='show-label-h3'>Create a Project</h3>
                  <div className="add-project-form">
                    <label >Project Name</label>
                    <input
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    {/* <label>Manager Name</label>
                    <input
                      value={newProject.manager}
                      onChange={(e) => setNewProject({ ...newProject, manager: e.target.value })}
                    /> */}
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={newProject.start}
                      onChange={(e) => setNewProject({ ...newProject, start: e.target.value })}
                    />
                    <label>End Date</label>
                    <input
                      type="date"
                      value={newProject.end}
                      onChange={(e) => setNewProject({ ...newProject, end: e.target.value })}
                    />
                    <label>Status</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Onhold">On Hold</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="action-buttons">
                      <button className="view-btn" onClick={handleSaveNewProject}>Submit</button>
                      <button className="close-btn" onClick={() => setShowCreateProjectModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
          ) }

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
                  {projects.map((project, index) => (
                    <tr key={index}>
                      <td>{index + 1}. {project.name}</td>
                      <td>{project.manager}</td>
                      <td>{project.start}</td>
                      <td>{project.end}</td>
                      <td>{project.status}</td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => {
                            setSelectedProject(project);
                            setActiveTab('Overview');
                          }}
                        >
                          View Project
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <hr />
              <h2>Selected Project Details</h2>
              {renderDetail()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Projects;

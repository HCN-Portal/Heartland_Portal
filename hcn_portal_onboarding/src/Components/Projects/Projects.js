import React, { useState } from 'react';
import './Projects.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";

const Projects = () => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [overviewErrors, setOverviewErrors] = useState({});
  // const [newManager, setNewManager] = useState({ name: '', email: '' });
  // const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });

  // Form validation schema using Yup
  const projectSchema = yup.object().shape({
    name: yup.string().required("Project name is required"),
    description: yup.string().required("Description is required"),
    manager: yup.string().required("Manager name is required"),
    start: yup.string().required("Start date is required"),
    end: yup.string().nullable().notRequired(),
    status: yup.string().required(),
    skillTags: yup.string().required("Skill tags are required"),
    client: yup.string().required("Client name is required"),
  });

  // React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    } = useForm({
    resolver: yupResolver(projectSchema),
  });

  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  // Static data for Project
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
    ],
    client: 'HCN',
    skillTags: 'ReactJS, MongoDB, Hosting, Node JS, Express JS'
  }
  ]);

  // Manager static data for View Manager Details
  const managerStaticData = {
  role: 'Manager',
  department: 'Project Management',
  projectCount: 2,
  joiningDate: '01/15/2023'
};
  
  const options = [
    { Name: "Manmohan", role: "Front-end Developer" },
    { Name: "Shalini", role: "Front-end Developer" },
    { Name: "Bindu", role: "Backend Developer" },
    { Name: "Praveen", role: "Backend Developer" },
    { Name: "Dhanush", role: "Manager" },
  ];

  // const response = await fetch('https://api.example.com/data');

  const [selectedOption, setSelectedOption] = useState(null);
  const [position, setPosition] = useState("");
  const handleChange = (selected) => {
    setSelectedOption(selected);
    setPosition(selected?.role ?? "");
  };


  const Managers=[
    { Name: "Manmohan", email: "manmohan@gmail.com" },
    { Name: "Shalini", email: "shalini@gmail.com" },
    { Name: "Bindu", email: "bindu@gmail.com" },
    { Name: "Praveen", email: "praveen@gmail.com" },
    { Name: "Dhanush", email: "dhanush@gmail.com" },
  ];

  const [selectedMOption, setSelectedMOption] = useState(null);
  const [email, setEmail] = useState("");
  const handleManagerChange = (selected) => {
    setSelectedMOption(selected);
    setEmail(selected?.email ?? "");
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
  // Make sure the user picked someone and an email is present
  if (!selectedMOption || !email.trim()) return;

  // Build the new manager object
  const newManager = {
    name:  selectedMOption.Name,  // or .value / .label – whichever holds the name
    email: email.trim(),
  };

  // Push it into the current project’s manager list
  const updatedManagers = [...selectedProject.managers, newManager];
  const updatedProject  = { ...selectedProject, managers: updatedManagers };

  setSelectedProject(updatedProject);
  setProjects(prev =>
    prev.map(p => (p.id === updatedProject.id ? updatedProject : p))
  );

  // Clear the picker and email field for the next entry
  setSelectedMOption(null);
  setEmail('');
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

  // Called when form is submitted to create a new project
  const handleSaveNewProject = (data) => {
    // Format start and end dates to display format
   
    // console.log('Triggerd Save event', data)
    const formattedStart = formatDateToDisplay(data.start);
    const formattedEnd = data.end ? formatDateToDisplay(data.end) : null;
     // Construct new project object and update state
    const projectToAdd = {
      id: projects.length + 1,
      ...data,
      start: formattedStart,
      end: formattedEnd,
      managers: [],
      employees: [],
      applications: [],
    };
    // console.log('Proojectss in Save ', projects)
    setProjects([...projects, projectToAdd]);
    alert("Project created successfully!");
    setShowCreateProjectModal(false);
    reset();
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
  // guard clause: make sure both pieces are filled in
  if (!selectedOption || !position) return;

  // format today’s date as e.g. 2025-07-10 ➜ 10 Jul 2025 (whatever your util does)
  const todayISO = new Date().toISOString().split('T')[0];
  const formattedDate = formatDateToDisplay(todayISO);

  // build the new employee record
  const newEmp = {
    name:     selectedOption.Name, // or .label – whichever you treat as "name"
    position: position,
    date:     formattedDate,
  };

  // clone + update current project
  const updated = {
    ...selectedProject,
    employees: [...selectedProject.employees, newEmp],
  };

  // push the change into state
  setSelectedProject(updated);
  setProjects((prev) =>
    prev.map((p) => (p.id === updated.id ? updated : p))
  );

  // clear the form
  setSelectedOption(null); // empties the <Select>
  setPosition('');         // clears the text field
};

// Removes Selected employee from the Selected Project

  const handleRemoveEmployee = (index) => {
  const updatedEmployees = selectedProject.employees.filter((_, i) => i !== index);
  const updatedProject = { ...selectedProject, employees: updatedEmployees };
  setSelectedProject(updatedProject);
  setProjects(prev =>
    prev.map(p => (p.id === selectedProject.id ? updatedProject : p))
  );
  };

  // Renders Tabs Content and detailed modal view of selected project
  // console.log(projects)
  // Controlled form inputs for editing project overview
  // Validates using Yup before saving changes
  const renderDetail = () => (
  <div className="project-modal">
    <div className="dashboard-header">
      <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Project Details: {selectedProject.id}. {selectedProject.name}
      </h2>
      <button className="close-btn" 
        onClick={() => {
        if (isEditingOverview) {
        alert("Please save your changes before closing.");
        } else {
        setSelectedProject(null);
        }
        }}
      >
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
            Project Details
             {/* : {selectedProject.name} */}
          </h3>

          <div className="project-detail-row">
            <div className="project-label"><strong>Project Name:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <div>
                <input
                  value={editedProject.name}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, name: e.target.value })
                  }
                />
                <p className="error-text">{overviewErrors.name}</p>
                </div>
                
              ) : (
                selectedProject.name
              )}
            </div>
          </div>

          <div className="project-detail-row">
            <div className="project-label"><strong>Description:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <div>
                <textarea
                  rows={6}
                  value={editedProject.description}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, description: e.target.value })
                  }
                />
                <p className="error-text">{overviewErrors.description}</p>
                </div>
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
                        start: e.target.value ? formatDateToDisplay(e.target.value) : null
                      })
                    }
                  />
                  <p className="error-text">{overviewErrors.start}</p>
                  {' '} 
                  -{' '}
                  <input
                    type="date"
                    value={formatDateForInput(editedProject.end)}
                    onChange={(e) =>{
                      const enddate = e.target.value ? formatDateToDisplay(e.target.value) : null;
                      setEditedProject({
                        ...editedProject,
                        end: enddate,
                      })
                    }}
                  />
                  <p className="error-text">{overviewErrors.end}</p>
                </>
                
              ) : (
                `${selectedProject.start} - ${selectedProject.end ?? "Ongoing"}`
              )}
            </div>
          </div>

          <div className="project-detail-row">
            <div className="project-label"><strong>Skill Tags:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <div>
                <textarea
                  rows={2}
                  value={editedProject.skillTags}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, skillTags: e.target.value })
                  }
                />
                <p className="error-text">{overviewErrors.skillTags}</p>
                </div>
              ) : (
                selectedProject.skillTags
              )}
            </div>
          </div>

          <div className="project-detail-row">
            <div className="project-label"><strong>Client Name:</strong></div>
            <div className="project-value">
              {isEditingOverview ? (
                <>
                
                <textarea
                  rows={1}
                  value={editedProject.client}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, client: e.target.value })
                  }
                />
                <p className="error-text">{overviewErrors.client}</p>
                </>
              ) : (
                selectedProject.client
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
              onClick={async () => {
                if (isEditingOverview) {
                  try {
                    // console.log("Edited project:", editedProject);
                    await projectSchema.validate(editedProject, { abortEarly: false });
                    // Validation passed
                    setSelectedProject(editedProject);
                    setProjects((prev) =>
                      prev.map((p) => (p.id === editedProject.id ? editedProject : p))
                    );
                    setOverviewErrors({});
                    setIsEditingOverview(false);
                  } catch (err) {
                    const formattedErrors = {};
                    if (err.inner) {
                      err.inner.forEach((e) => {
                        formattedErrors[e.path] = e.message;
                      });
                    }
                    // console.log("Validation failed", err);
                    setOverviewErrors(formattedErrors);
                  }
                } else {
                  setEditedProject({ ...selectedProject });
                  setOverviewErrors({});
                  setIsEditingOverview(true);
                }
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
                    ...m,
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
            <div style={{ width: 200 }}>
              <Select
                options={Managers}
                onChange={handleManagerChange}
                type="text"
                placeholder="Name"
                value={selectedMOption}
                isSearchable
                getOptionLabel={(opt) => opt.Name}
                getOptionValue={(opt) => opt.Name}
              />
              </div>
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled="true"
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
          <div style={{ width: 200 }}>
              <Select
                options={options}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                value={selectedOption}
                isSearchable
                getOptionLabel={(opt) => opt.Name}
                getOptionValue={(opt) => opt.Name}
              />
              </div>
              <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                disabled="true"
                // onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
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

            {/* Conditional rendering for the create project modal */}
            
            {showCreateProjectModal && (
                <div className="modal-backdrop" onClick={() => setShowCreateProjectModal(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3 className="show-label-h3">Create a Project</h3>
                    {/* <form onSubmit={handleSubmit(handleSaveNewProject)}> */}
                    <form onSubmit={handleSubmit(handleSaveNewProject, (err) => console.log(" Validation failed", err))}>
                    <div className="add-project-form">

                      
                      <label>Project Name *</label>
                      <div>
                      <input {...register("name")} />
                      <p className="error-text">{errors.name?.message}</p>
                      </div>

                      <label>Description *</label>
                      <div>
                      <textarea rows={3} cols={50} {...register("description")} />
                      <p className="error-text">{errors.description?.message}</p>
                      </div>
                      

                      <label>Manager Name *</label>
                      <div>
                      <input {...register("manager")} />
                      <p className="error-text">{errors.manager?.message}</p>
                      </div>
                      
                      <label>Start Date *</label>
                      <div>
                      <input type="date" {...register("start")} />
                      <p className="error-text">{errors.start?.message}</p>
                      </div>
                     
                      <label>End Date</label>
                      <input type="date" {...register("end")} />

                      <label>Status</label>
                      <select {...register("status")}>
                        <option value="Active">Active</option>
                        <option value="Onhold">On Hold</option>
                        <option value="Inactive">Inactive</option>
                      </select>

                      <label>Skill Tags *</label>
                      <div>
                      <input {...register("skillTags")} />
                      <p className="error-text">{errors.skillTags?.message}</p>
                      </div>
                      
                      <label>Client Name *</label>
                      <div>
                      <input {...register("client")} />
                      <p className="error-text">{errors.client?.message}</p>
                      </div>

                      <div className="action-buttons">
                        <button className="view-btn" type="submit" onClick={() => console.log("Submit button clicked")}>
                          Submit
                        </button>
                        <button
                          className="close-btn"
                          type="button"
                          onClick={() => {reset(); setShowCreateProjectModal(false);}}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    </form>
                  </div>
                </div>
              )}


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
                      <td>{project.end ? project.end : "Ongoing"}</td>
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
import React, { useState, useEffect } from "react";
import "./Projects.css";
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import Select from "react-select";
import axios from "axios";

const Projects = () => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [newManager, setNewManager] = useState({ name: "", email: "" });
  const [newEmployee, setNewEmployee] = useState({ name: "", position: "" });
  const [employeeList, setEmployeeList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    manager: "Not Assigned",
    start: "",
    end: "N/A",
    status: "Active",
  });

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "HCN Portal",
      manager: "Dhanush",
      start: "04/08/2025",
      end: "04/23/2026",
      status: "Active",
      description:
        "The HCN Portal (Heartland Community Network Portal) is a web platform designed for efficient community management, providing administrators, managers, and employees with role-specific dashboards. Administrators can manage employees, create projects, and monitor applications. Managers oversee their teams, manage projects, and approve timesheets. Employees can view assigned projects, submit timesheets, and update profiles. The portal features role-based access controls, ensuring each user has access to relevant features. Admins can assign projects, managers can supervise teams, and employees can engage with assigned tasks. Automated workflows streamline approvals, while secure data handling ensures compliance. The modular design allows easy customization and scalability for various organizational needs.",
      managers: [{ name: "Dhanush", email: "dhanush@admin.hcn.com" }],
      employees: [
        { name: "Harshitha", position: "Developer", date: "04/08/2025" },
        { name: "Likhitha", position: "Developer", date: "04/08/2025" },
        { name: "Preeth", position: "Developer", date: "04/08/2025" },
      ],
      applications: [
        { name: "ManagerX", position: "Manager" },
        { name: "EmployeeY", position: "Employee" },
      ],
    },
  ]);

  const managerStaticData = {
    name: "Dhanush",
    email: "dhanush@admin.hcn.com",
    role: "Manager",
    department: "Project Management",
    projectCount: 2,
    joiningDate: "01/15/2023",
  };

  const options = [
    { Name: "Manmohan", role: "Front-end Developer" },
    { Name: "Shalini", role: "Front-end Developer" },
    { Name: "Bindu", role: "Backend Developer" },
    { Name: "Praveen", role: "Backend Developer" },
    { Name: "Dhanush", role: "Manager" },
  ];

  // const response = await fetch('https://api.example.com/data');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users/"); // Assuming this API fetches all users
        const users = response.data;

        // Filter users with role 'employee'
        const employees = users
          .filter((user) => user.role === "employee")
          .map((user) => ({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          }));

        // Filter users with role 'manager'
        const managers = users
          .filter((user) => user.role === "manager")
          .map((user) => ({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          }));

        // Set the filtered lists into the state
        setEmployeeList(employees);
        setManagerList(managers);
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const formattedEmployeeList = employeeList.map((employee) => ({
    label: employee.name, // Display only the name
    email: employee.email, // You can still use email or any unique field for value
  }));

  const formattedManagerList = managerList.map((manager) => ({
    label: manager.name, // Display only the name
    email: manager.email, // You can still use email or any unique field for value
  }));

  const [selectedOption, setSelectedOption] = useState(null);
  const [position, setPosition] = useState("");
  const handleChange = (selected) => {
    console.log("handleChange called with:", selected);
    setSelectedOption(selected);
    if (selected) {
      setPosition(selected.email ?? "");
      console.log("Setting position to:", selected.email);
    } else {
      setPosition("");
      console.log("Clearing position");
    }
  };

 /* const Managers = [
    { Name: "Manmohan", email: "manmohan@gmail.com" },
    { Name: "Shalini", email: "shalini@gmail.com" },
    { Name: "Bindu", email: "bindu@gmail.com" },
    { Name: "Praveen", email: "praveen@gmail.com" },
    { Name: "Dhanush", email: "dhanush@gmail.com" },
  ]; */

  const [selectedMOption, setSelectedMOption] = useState(null);
  const [email, setEmail] = useState("");
  /* const handleManagerChange = (selected) => {
    setSelectedMOption(selected);
    setEmail(selected?.email ?? "");
  }; */

  const handleManagerChange = (selectedOption) => {
    setSelectedMOption(selectedOption); // Set the selected manager
    if (selectedOption) {
      setEmail(selectedOption.email); // Set email based on the selected option's value (email)
    } else {
      setEmail(""); // Clear email if no option is selected
    }
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedManagerDetails, setselectedManagerDetails] = useState(null);

  // const tabs = ['Overview', 'Managers', 'Employees', 'Applications', 'Updates/Activity'];
  const tabs = ["Overview", "Managers", "Employees"];

  // Handlers

  // const formatDateForInput = (dateString) => {
  //   const [month, day, year] = dateString.split('/');
  //   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  // };
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    if (dateString.includes("/")) {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else if (dateString.includes("-")) {
      return dateString; // already in correct format
    }

    return "";
  };

  const formatDateToDisplay = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  const handleAddManager = () => {
    // Make sure the user picked someone and an email is present
    if (!selectedMOption || !email.trim()) return;

    // Build the new manager object
    const newManager = {
      name: selectedMOption.label, // Use label which contains the name
      email: email.trim(),
    };

    // Push it into the current project’s manager list
    const updatedManagers = [...selectedProject.managers, newManager];
    const updatedProject = { ...selectedProject, managers: updatedManagers };

    setSelectedProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );

    // Clear the picker and email field for the next entry
    setSelectedMOption(null);
    setEmail("");
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

  const handleRemoveManager = (index) => {
    /* remove manager logic */
    const updatedManagers = selectedProject.managers.filter(
      (_, i) => i !== index
    );
    const updatedProject = { ...selectedProject, managers: updatedManagers };
    setSelectedProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? updatedProject : p))
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
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
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
      description: "",
      managers: [],
      employees: [],
      applications: [],
    };
    setProjects([...projects, projectToAdd]);
    setShowCreateProjectModal(false);
    setNewProject({
      name: "",
      manager: "Not Assigned",
      start: "",
      end: "",
      status: "Active",
    });
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

    console.log("Selected option:", selectedOption);
    console.log("Position:", position);

    // format today's date as e.g. 2025-07-10 ➜ 10 Jul 2025 (whatever your util does)
    const todayISO = new Date().toISOString().split("T")[0];
    const formattedDate = formatDateToDisplay(todayISO);

    // build the new employee record
    const newEmp = {
      name: selectedOption.label, // Use label which contains the name
      position: position,
      date: formattedDate,
    };

    console.log("New employee object:", newEmp);

    // clone + update current project
    const updated = {
      ...selectedProject,
      employees: [...selectedProject.employees, newEmp],
    };

    console.log("Updated project:", updated);

    // push the change into state
    setSelectedProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    // clear the form
    setSelectedOption(null); // empties the <Select>
    setPosition(""); // clears the text field
  };

  const handleRemoveEmployee = (index) => {
    const updatedEmployees = selectedProject.employees.filter(
      (_, i) => i !== index
    );
    const updatedProject = { ...selectedProject, employees: updatedEmployees };
    setSelectedProject(updatedProject);
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? updatedProject : p))
    );
  };

  // Render Tabs Content

  console.log(projects);

  const renderDetail = () => (
    <div className="project-modal">
      <div className="dashboard-header">
        <h2 style={{ marginTop: "1rem", marginBottom: "1rem" }}>
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
            className={`tab-button ${activeTab === tab ? "active-tab" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="project-content">
        {activeTab === "Overview" && (
          <div className="project-modal">
            <h3 className="show-label-h3">
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
              <div className="project-label">
                <strong>Description:</strong>
              </div>
              <div className="project-value">
                {isEditingOverview ? (
                  <textarea
                    rows={6}
                    value={editedProject.description}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  selectedProject.description
                )}
              </div>
            </div>

            <div className="project-detail-row">
              <div className="project-label">
                <strong>Start Date - End Date:</strong>
              </div>
              <div className="project-value">
                {isEditingOverview ? (
                  <>
                    <input
                      type="date"
                      value={formatDateForInput(editedProject.start)}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          start: formatDateToDisplay(e.target.value),
                        })
                      }
                    />{" "}
                    -{" "}
                    <input
                      type="date"
                      value={formatDateForInput(editedProject.end)}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          end: formatDateToDisplay(e.target.value),
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
              <div className="project-label">
                <strong>Status:</strong>
              </div>
              <div className="project-value">
                {isEditingOverview ? (
                  <select
                    value={editedProject.status}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        status: e.target.value,
                      })
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

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="edit-btn"
                onClick={() => {
                  if (isEditingOverview) {
                    setSelectedProject(editedProject);
                    setProjects((prev) =>
                      prev.map((p) =>
                        p.id === editedProject.id ? editedProject : p
                      )
                    );
                  } else {
                    setEditedProject({ ...selectedProject });
                  }
                  setIsEditingOverview(!isEditingOverview);
                }}
              >
                {isEditingOverview ? "Save" : "Edit Details"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "Managers" && (
          <div className="project-modal fade-in">
            <h3 className="show-label-h3">Manager Details</h3>

            {selectedProject.managers.map((m, i) => (
              <div key={i} className="manager-card">
                <div className="manager-info">
                  <p className="manager-label">Manager {i + 1}</p>
                  <div className="manager-field">
                    <strong>Name:</strong> <span>{m.name}</span>
                  </div>
                  <div className="manager-field">
                    <strong>Email Id:</strong> <span>{m.email}</span>
                  </div>
                </div>
                <div className="manager-actions">
                  <button
                    className="view-btn"
                    onClick={() =>
                      setselectedManagerDetails({
                        ...managerStaticData,
                      })
                    }
                  >
                    View Profile
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveManager(i)}
                  >
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
                    options={formattedManagerList}
                    onChange={handleManagerChange}
                    placeholder="Select Manager"
                    value={selectedMOption}
                    isSearchable
                    getOptionLabel={(opt) => opt.label} // Displays the label
                    getOptionValue={(opt) => opt.email} // Sets the value (email, in this case)
                    isClearable
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

        {activeTab === "Employees" && (
          <div className="project-modal fade-in">
            <h3 className="show-label-h3">Employees Details</h3>
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
                    <td>
                      {i + 1}. {e.name}
                    </td>
                    <td>{e.position}</td>
                    <td>{e.date}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedEmployee({
                            name: e.name,
                            position: e.position,
                            date: e.date,
                          })
                        }
                      >
                        View Profile
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveEmployee(i)}
                      >
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
                  options={formattedEmployeeList}
                  onChange={handleChange}
                  type="text"
                  placeholder="Name"
                  value={selectedOption}
                  isSearchable
                  getOptionLabel={(opt) => opt.label}
                  getOptionValue={(opt) => opt.email}
                />
              </div>
              <input
                type="text"
                placeholder="Email"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                disabled="true"
                // onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
              <button className="edit-btn" onClick={handleAddEmployee}>
                Add Employee
              </button>
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
                <li>
                  <a href="/admin/home">Home / Dashboard</a>
                </li>
                <li>
                  <a href="/admin/pending">Pending Applications</a>
                </li>
                <li>
                  <a href="/admin/employees">Active Employees</a>
                </li>
                <li>
                  <a href="/admin/projects" style={{ fontWeight: "900" }}>
                    Projects
                  </a>
                </li>
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
                <button
                  className="create-project-btn"
                  onClick={() => setShowCreateProjectModal(true)}
                >
                  + Create Project
                </button>
              </div>

              {showCreateProjectModal && (
                <div
                  className="modal-backdrop"
                  onClick={() => setShowCreateProjectModal(false)}
                >
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="show-label-h3">Create a Project</h3>
                    <div className="add-project-form">
                      <label>Project Name</label>
                      <input
                        value={newProject.name}
                        onChange={(e) =>
                          setNewProject({ ...newProject, name: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            start: e.target.value,
                          })
                        }
                      />
                      <label>End Date</label>
                      <input
                        type="date"
                        value={newProject.end}
                        onChange={(e) =>
                          setNewProject({ ...newProject, end: e.target.value })
                        }
                      />
                      <label>Status</label>
                      <select
                        value={newProject.status}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Onhold">On Hold</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={handleSaveNewProject}
                        >
                          Submit
                        </button>
                        <button
                          className="close-btn"
                          onClick={() => setShowCreateProjectModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
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
                      <td>
                        {index + 1}. {project.name}
                      </td>
                      <td>{project.manager}</td>
                      <td>{project.start}</td>
                      <td>{project.end}</td>
                      <td>{project.status}</td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => {
                            setSelectedProject(project);
                            setActiveTab("Overview");
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

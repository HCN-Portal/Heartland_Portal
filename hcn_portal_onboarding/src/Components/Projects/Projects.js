import React, { useState, useEffect } from "react";
import "./Projects.css";
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import Select from "react-select";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Sidebar from "../Sidebar/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  clearSelectedProject,
  getEmployees,
  getManagers,
  getAllProjectTitles,
  getProjectById,
  updateProjectByID,
  addEmployeesToProject,
  addManagersToProject,
  removeManagersFromProject,
  removeEmployeesFromProject,
  createProject,
} from "../../store/reducers/projectReducer";
import {
  clearSelectedUser,
  get_all_users,
  get_user_by_id,
} from "../../store/reducers/userReducer";

const Projects = () => {
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [overviewErrors, setOverviewErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 2;
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  // Form validation schema using Yup
  const projectSchema = yup.object().shape({
    title: yup.string().required("Project title is required"),
    description: yup.string().required("Description is required"),
    // manager: yup.string().required("Manager name is required"),
    startDate: yup.string().required("Start date is required"),
    endDate: yup.string().nullable().notRequired(),
    // status: yup.string().required(),
    skillTags: yup.string().required("Skill tags are required"),
    client: yup.string().required("Client name is required"),
  });

  const createProjectSchema = yup.object().shape({
    title: yup.string().required("Project title is required"),
    description: yup.string().required("Description is required"),
    manager: yup
      .object({
        managerId: yup.string().required(),
        name: yup.string().required(),
      })
      .nullable()
      .required("Manager name is required"),
    startDate: yup.string().required("Start date is required"),
    endDate: yup.string().nullable().notRequired(),
    status: yup.string().required(),
    skillTags: yup.string().required("Skill tags are required"),
    client: yup.string().required("Client name is required"),
  });

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

  // React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createProjectSchema),
  });

  const dispatch = useDispatch();
  const { projects, loadingl, selectedProjectl, employees, managers } =
    useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getAllProjectTitles());
    dispatch(getManagers());
    dispatch(getEmployees());
  }, [dispatch]);

  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];
  // Filter projects by search term (project name or manager name)
  const filteredProjects = safeProjects.filter((project) => {
    const titleMatch =
      project.title &&
      project.title.toLowerCase().includes(searchTerm.toLowerCase());
    // manager name can be an array, check all
    const managerMatch = Array.isArray(project.managers)
      ? project.managers.some(
          (mgr) =>
            mgr &&
            mgr.name &&
            mgr.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : false;
    return titleMatch || managerMatch;
  });
  // Pagination on filtered projects
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const formattedEmployeeList = employees.map((employee) => ({
    label: employee.fullName, // Display only the name
    email: employee.email,
    id: employee.id,
  }));
  const formattedManagerList = managers.map((manager) => ({
    label: manager.fullName, // Display only the name
    email: manager.email,
    id: manager.id,
  }));

  const [selectedOption, setSelectedOption] = useState(null);
  const [position, setPosition] = useState("");

  const handleChange = (selected) => {
    // console.log("handleChange called with:", selected);
    setSelectedOption(selected);
    // console.log(selectedOption,"selectedOption")
    if (selected) {
      setPosition(selected.email ?? "");
      // console.log("Setting position to:", selected.email);
    } else {
      setPosition("");
      // console.log("Clearing position");
    }
  };

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Id$/, "ID")
      .replace(/Ead/g, "EAD")
      .replace(/Dob/g, "DOB");
  };

  const formatValue = (key, value) => {
    const dateFields = [
      "dob",
      "eadStartDate",
      "visaEADExpiryDate",
      "dateOfSubmission",
    ];
    if (key === "projectsAssigned" && Array.isArray(value)) {
      return value.map((p) => p.title).join(", ") || "Unassigned";
    }
    if (dateFields.includes(key) && value) {
      const date = new Date(value);
      return date.toLocaleDateString("en-US");
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return value || "N/A";
  };
  useEffect(() => {
    console.log(selectedProjectl);
  }, [selectedProjectl]);

  const [selectedMOption, setSelectedMOption] = useState(null);
  const [email, setEmail] = useState("");

  const handleManagerChange = (selectedOption) => {
    setSelectedMOption(selectedOption); // Set the selected manager
    if (selectedOption) {
      setEmail(selectedOption.email); // Set email based on the selected option's value (email)
    } else {
      setEmail(""); // Clear email if no option is selected
    }
  };

  const { users, selectedUser } = useSelector((state) => state.users);
  const [selectedManagerDetails, setselectedManagerDetails] = useState(null);

  // const tabs = ['Overview', 'Managers', 'Employees', 'Applications', 'Updates/Activity'];
  const tabs = ["Overview", "Managers", "Employees"];

  // Handlers

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

  const handleEachProject = (projectId) => {
    dispatch(getProjectById(projectId));
  };

  const handleEdit = (editedProject) => {
    // console.log(editedProject, "inside handleEdit")
    dispatch(
      updateProjectByID({
        projectId: editedProject._id,
        editedProject: editedProject,
      })
    );
  };

  const handleAddManager = () => {
    // Make sure the user picked someone and an email is present
    if (!selectedMOption || !email.trim()) return;

    // Build the new manager object
    const newManager = {
      managerId: selectedMOption.id,
      name: selectedMOption.label,
    };

    const requestBody = { managers: [newManager] };
    const projectId = selectedProjectl._id;
    dispatch(addManagersToProject({ projectId, requestBody }));

    // Clear the picker and email field for the next entry
    setSelectedMOption(null);
    setEmail("");
  };

  const handleRemoveManager = (m) => {
    /* remove manager logic */
    const managerId = m.managerId;
    const projectId = selectedProjectl._id;
    dispatch(removeManagersFromProject({ projectId, managerId }));
  };

  const ProfileModal = ({ data, onClose, title }) => (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title} jfn</h3>
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

  // Called when form is submitted to create a new project
  const handleSaveNewProject = (data) => {
    const formattedStart = formatDateToDisplay(data.startDate);
    const formattedEnd = data.endDate
      ? formatDateToDisplay(data.endDate)
      : null;
    const managers = [];
    managers.push(data.manager);
    // Construct new project object and update state
    const projectToAdd = {
      title: data.title,
      description: data.description,
      managers: managers,
      startDate: formattedStart,
      endDate: formattedEnd,
      status: data.status,
      teamMembers: [],
      skillTags: data.skillTags,
      client: data.client,
    };

    dispatch(createProject({ projectToAdd }));

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

  const handleViewProfile = (e) => {
    const userId = e.employeeId ? e.employeeId : e.managerId;
    dispatch(get_user_by_id(userId));
  };

  const handleAddEmployee = () => {
    // guard clause: make sure both pieces are filled in
    if (!selectedOption || !position) return;

    // console.log("Selected option:", selectedOption);
    // console.log("Position:", position);

    // format today's date as e.g. 2025-07-10 ➜ 10 Jul 2025 (whatever your util does)
    const todayISO = new Date().toISOString().split("T")[0];
    const formattedDate = formatDateToDisplay(todayISO);

    // build the new employee record
    const newEmployees = {
      employeeId: selectedOption.id,
      name: selectedOption.label,
    };
    const requestBody = { employees: [newEmployees] };

    const projectId = selectedProjectl._id;
    dispatch(addEmployeesToProject({ projectId, requestBody }));

    // clear the form
    setSelectedOption(null); // empties the <Select>
    setPosition(""); // clears the text field
  };

  const handleRemoveEmployee = (e) => {
    const employeeId = e.employeeId;
    const projectId = selectedProjectl._id;
    dispatch(removeEmployeesFromProject({ projectId, employeeId }));
  };

  // Renders Tabs Content and detailed modal view of selected project
  // Controlled form inputs for editing project overview
  // Validates using Yup before saving changes

  const renderDetail = () => (
    <div className="project-modal">
      <div className="dashboard-header">
        {/* <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Project Details: {selectedProjectl._id}. {selectedProjectl.title}
      </h2> */}
        <button
          className="close-btn"
          onClick={() => {
            if (isEditingOverview) {
              alert("Please save your changes before closing.");
            } else {
              dispatch(clearSelectedProject());
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
            <h3 className="show-label-h3">Project Details</h3>

            <div className="project-detail-row">
              <div className="project-label">
                <strong>Project Name:</strong>
              </div>
              <div className="project-value">
                {isEditingOverview ? (
                  <div>
                    <input
                      value={editedProject.title}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          title: e.target.value,
                        })
                      }
                    />
                    <p className="error-text">{overviewErrors.title}</p>
                  </div>
                ) : (
                  selectedProjectl.title
                )}
              </div>
            </div>

            <div className="project-detail-row">
              <div className="project-label">
                <strong>Description:</strong>
              </div>
              <div className="project-value">
                {isEditingOverview ? (
                  <div>
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
                    <p className="error-text">{overviewErrors.description}</p>
                  </div>
                ) : (
                  selectedProjectl.description
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
                      value={formatDateForInput(editedProject.startDate)}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          startDate: e.target.value
                            ? formatDateToDisplay(e.target.value)
                            : null,
                        })
                      }
                    />
                    <p className="error-text">{overviewErrors.startDate}</p> -{" "}
                    <input
                      type="date"
                      value={formatDateForInput(editedProject.endDate)}
                      onChange={(e) => {
                        const enddate = e.target.value
                          ? formatDateToDisplay(e.target.value)
                          : null;
                        setEditedProject({
                          ...editedProject,
                          endDate: enddate,
                        });
                      }}
                    />
                    <p className="error-text">{overviewErrors.endDate}</p>
                  </>
                ) : (
                  `${selectedProjectl.startDate} - ${
                    selectedProjectl.endDate ?? "Ongoing"
                  }`
                )}
              </div>
            </div>

            <div className="project-detail-row">
              <div className="project-label">
                <strong>Skill Tags:</strong>
              </div>
              <div className="project-value">
                {isEditingOverview ? (
                  <div>
                    <textarea
                      rows={2}
                      value={editedProject.skillTags}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          skillTags: e.target.value,
                        })
                      }
                    />
                    <p className="error-text">{overviewErrors.skillTags}</p>
                  </div>
                ) : (
                  <p>{selectedProjectl.skillTags?.join(", ") || ""}</p>
                )}
              </div>
            </div>

            <div className="project-detail-row">
              <div className="project-label">
                <strong>Client Name:</strong>
              </div>
              <div className="project-value">
                {isEditingOverview ? (
                  <>
                    <textarea
                      rows={1}
                      value={editedProject.client}
                      onChange={(e) =>
                        setEditedProject({
                          ...editedProject,
                          client: e.target.value,
                        })
                      }
                    />
                    <p className="error-text">{overviewErrors.client}</p>
                  </>
                ) : (
                  selectedProjectl.client
                )}
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="edit-btn"
                onClick={async () => {
                  if (isEditingOverview) {
                    try {
                      console.log("before val", editedProject);
                      const projectForValidation = {
                        title: editedProject.title,
                        description: editedProject.description,
                        startDate: editedProject.startDate,
                        endDate: editedProject.endDate,
                        client: editedProject.client,
                        skillTags: editedProject.skillTags,
                      };
                      await projectSchema.validate(projectForValidation, {
                        abortEarly: false,
                      });
                      // Validation passed
                      handleEdit(editedProject);
                      console.log("Edited project after:", editedProject);
                      setOverviewErrors({});
                      setIsEditingOverview(false);
                    } catch (err) {
                      console.log("err", err);
                      const formattedErrors = {};
                      if (err.inner) {
                        err.inner.forEach((e) => {
                          formattedErrors[e.path] = e.message;
                        });
                      }
                      console.log("Validation failed", formattedErrors);
                      setOverviewErrors(formattedErrors);
                    }
                  } else {
                    setEditedProject({ ...selectedProjectl });
                    setOverviewErrors({});
                    setIsEditingOverview(true);
                  }
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

            {selectedProjectl.managers.map((m, i) => (
              <div key={i} className="manager-card">
                <div className="manager-info">
                  <p className="manager-label">Manager {i + 1}</p>
                  <div className="manager-field">
                    <strong>Name:</strong> <span>{m.name}</span>
                  </div>
                  <div className="manager-field">
                    <strong>Email Id:</strong> <span>{m.id}</span>
                  </div>
                </div>
                <div className="manager-actions">
                  <button
                    className="view-btn"
                    onClick={() => handleViewProfile(m)}
                  >
                    View Profile
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveManager(m)}
                  >
                    Remove Manager
                  </button>
                </div>
              </div>
            ))}

            {selectedUser && (
              <div
                className="modal-backdrop"
                onClick={() => dispatch(clearSelectedUser())}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>Employee Profile</h3>
                  <table className="profile-table">
                    <tbody>
                      {Object.entries(selectedUser)
                        .filter(
                          ([key]) =>
                            !["_id", "__v", "acknowledgments"].includes(key)
                        )
                        .map(([key, value]) => (
                          <tr key={key}>
                            <td className="profile-label">
                              {formatLabel(key)}
                            </td>
                            <td className="profile-value">
                              {formatValue(key, value)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="action-buttons">
                    <button
                      className="close-btn"
                      onClick={() => dispatch(clearSelectedUser())}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
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
                {selectedProjectl?.teamMembers.map((e, i) => (
                  <tr key={i}>
                    <td>
                      {i + 1}. {e.name}
                    </td>
                    <td>{e.name}</td>
                    {/* <td>{e.date}</td> */}
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewProfile(e)}
                      >
                        View Profile
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveEmployee(e)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedUser && (
              <div
                className="modal-backdrop"
                onClick={() => dispatch(clearSelectedUser())}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>Employee Profile</h3>
                  <table className="profile-table">
                    <tbody>
                      {Object.entries(selectedUser)
                        .filter(
                          ([key]) =>
                            !["_id", "__v", "acknowledgments"].includes(key)
                        )
                        .map(([key, value]) => (
                          <tr key={key}>
                            <td className="profile-label">
                              {formatLabel(key)}
                            </td>
                            <td className="profile-value">
                              {formatValue(key, value)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="action-buttons">
                    <button
                      className="close-btn"
                      onClick={() => dispatch(clearSelectedUser())}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
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
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        {/* <button
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
                  <a href="/admin/employees">Employees</a>
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
        )} */}

        <main className="pending-main">
          {!selectedProjectl ? (
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

              {/* Conditional rendering for the create project modal */}

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
                    {/* <form onSubmit={handleSubmit(handleSaveNewProject)}> */}
                    <form
                      onSubmit={handleSubmit(handleSaveNewProject, (err) =>
                        console.log(" Validation failed", err)
                      )}
                    >
                      <div className="add-project-form">
                        <label>Project Name *</label>
                        <div>
                          <input {...register("title")} />
                          <p className="error-text">{errors.title?.message}</p>
                        </div>

                        <label>Description *</label>
                        <div>
                          <textarea
                            rows={3}
                            cols={50}
                            {...register("description")}
                          />
                          <p className="error-text">
                            {errors.description?.message}
                          </p>
                        </div>

                        {/* 
                      <label>Manager Name *</label>
                      <div>
                      <input {...register("manager")} />
                      <p className="error-text">{errors.manager?.message}</p>
                      </div> */}

                        <label>Manager Name *</label>
                        <div>
                          <select
                            {...register("manager", {
                              required: "Manager is required",
                              setValueAs: (val) => {
                                const e = formattedManagerList.find(
                                  (x) => (x._id ?? x.id) === val
                                );
                                return e
                                  ? { managerId: e._id ?? e.id, name: e.label }
                                  : null;
                              },
                            })}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select a manager…
                            </option>
                            {formattedManagerList.map((e) => (
                              <option key={e.id} value={e.id}>
                                {e.label}
                              </option>
                            ))}
                          </select>
                          <p className="error-text">
                            {errors.manager?.message}
                          </p>
                        </div>

                        <label>Start Date *</label>
                        <div>
                          <input type="date" {...register("startDate")} />
                          <p className="error-text">{errors.start?.message}</p>
                        </div>

                        <label>End Date</label>
                        <input type="date" {...register("endDate")} />

                        <label>Status</label>
                        <select {...register("status")}>
                          <option value="Active">Active</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Inactive">Inactive</option>
                        </select>

                        <label>Skill Tags *</label>
                        <div>
                          <input {...register("skillTags")} />
                          <p className="error-text">
                            {errors.skillTags?.message}
                          </p>
                        </div>

                        <label>Client Name *</label>
                        <div>
                          <input {...register("client")} />
                          <p className="error-text">{errors.client?.message}</p>
                        </div>

                        <div className="action-buttons">
                          <button
                            className="view-btn"
                            type="submit"
                            onClick={() => console.log("submit clicked")}
                          >
                            Submit
                          </button>
                          <button
                            className="close-btn"
                            type="button"
                            onClick={() => {
                              reset();
                              setShowCreateProjectModal(false);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Search Input */}
              <div className="projects-search-bar">
                <input
                  type="text"
                  placeholder="Search by project name or manager name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                  {Array.isArray(currentProjects) &&
                  currentProjects.length > 0 ? (
                    currentProjects.map((project, index) => (
                      <tr key={index}>
                        <td>
                          {index + 1}. {project.title}
                        </td>
                        <td>
                          {project.managers && project.managers[0]
                            ? project.managers[0].name
                            : "None"}
                        </td>
                        <td>{project.startDate}</td>
                        <td>{project.endDate ? project.endDate : "Ongoing"}</td>
                        <td>{project.status}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => {
                              handleEachProject(project._id);
                              // setSelectedProject(project);
                              setActiveTab("Overview");
                            }}
                          >
                            View Project
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="pagination-controls">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
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

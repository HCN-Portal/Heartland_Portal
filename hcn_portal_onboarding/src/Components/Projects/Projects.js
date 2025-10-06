import React, { useState, useEffect, useMemo } from "react";
import "./Projects.css";
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import Select from "react-select";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Sidebar from "../Sidebar/Sidebar";
import SkillsMultiSelect from '../SkillsMultiSelect.jsx'
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
  getProjectApplicationsById,
  approveProjectApplication,
  declineProjectApplication,
} from "../../store/reducers/projectReducer";
import {
  clearSelectedUser,
  get_user_by_id,
  setSelectedUser,
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
  const projectsPerPage = 6;
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

const LANGUAGE_OPTIONS = [
  "JavaScript","TypeScript","Python","Java","C#","C++","Go","Rust","PHP","Ruby",
  "Kotlin","Swift","Scala","Dart","R","SQL","Tableau","Power BI", "Mongo DB", "React", "Angular", "Node","Express" , "Spring Boot"
];



  // Form validation schema using Yup
  const projectSchema = yup.object().shape({
    title: yup.string().required("Project title is required"),
    description: yup.string().required("Description is required"),
    // manager: yup.string().required("Manager name is required"),
    startDate: yup.string().required("Start date is required"),
    endDate: yup.string().nullable().notRequired(),
    // status: yup.string().required(),
    // skillTags: yup.string().required("Skill tags are required"),
     skillTags: yup.array().of(yup.string().trim()).min(1, "Pick at least one skill").required(),
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
    // skillTags: yup.string().required("Skill tags are required"),
    skillTags: yup
    .array()
    .of(yup.string().trim())
    .min(1, "Pick at least one skill")
    .required("Skill tags are required"),
    client: yup.string().required("Client name is required"),
  });


 

  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
 

  // React Hook Form setup with Yup validation
  const {
     control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createProjectSchema),
  });

  const dispatch = useDispatch();
  const { projects, selectedProjectl, employees, managers } =
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

  // global profile modal will be rendered inside returned JSX (so it has access to selectedUser)

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




  const { selectedUser } = useSelector((state) => state.users);

  // const tabs = ['Overview', 'Managers', 'Employees', 'Applications', 'Updates/Activity'];
  const tabs = ["Overview", "Managers", "Employees", "Applications"];

  // Handlers

  const formatDateForInput = (dateString) => {
    console.log(dateString)
    if (!dateString) return "";

    if (dateString.includes("/")) {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else if (dateString.includes("-")) {
      return dateString.split("T")[0]; // already in correct format
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
      email:selectedMOption.email
    };

    const requestBody = { managers: [newManager] };
    const projectId = selectedProjectl._id;
    dispatch(addManagersToProject({ projectId, requestBody }));

    // Clear the picker and email field for the next entry
    setSelectedMOption(null);
    setEmail("");
  };

  const handleRemoveManager = async (m) => {
    // remove manager logic - support different id shapes returned by API
    const managerId = m?.managerId || m?._id || m?.id;
    const projectId = selectedProjectl?._id;
    console.log('handleRemoveManager called', { m, managerId, projectId });
    if (!managerId || !projectId) {
      console.warn('Cannot remove manager - missing managerId or projectId', { m, selectedProjectl });
      return;
    }
    try {
      const result = await dispatch(removeManagersFromProject({ projectId, managerId })).unwrap();
      console.log('remove manager result', result);
      // refresh project details to reflect removal
      dispatch(getProjectById(projectId));
    } catch (err) {
      console.error('remove manager failed', err);
      alert('Failed to remove manager. See console for details.');
    }
  };

  // Profile modal helper removed — using `selectedUser` modal blocks below instead

  // Called when form is submitted to create a new project
  const handleSaveNewProject = (data) => {
    const formattedStart = formatDateToDisplay(data.startDate);
    const formattedEnd = data.endDate ? formatDateToDisplay(data.endDate) : null;
    const managers = []
    managers.push(data.manager)
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
    console.log('handleViewProfile called with', e);

    // Build a local user object from whatever fields are available so modal appears immediately
    const maybeNested = e && typeof e === 'object' && (e.employeeId || e.managerId) ? (e.employeeId && typeof e.employeeId === 'object' ? e.employeeId : (e.managerId && typeof e.managerId === 'object' ? e.managerId : null)) : null;
    const source = maybeNested || e;

    const localUser = {
      firstName: source?.firstName || source?.name?.split?.(' ')?.[0] || '',
      lastName: source?.lastName || (source?.name ? source.name.split(' ').slice(1).join(' ') : ''),
      preferredName: source?.preferredName || '',
      email: source?.email || '',
      employeeId: source?._id || source?.id || source?.employeeId || source?.managerId || '',
      projectsAssigned: source?.projectsAssigned || [],
    };

    // Show quick modal immediately
    dispatch(setSelectedUser(localUser));

    // If we have an id, fetch full profile to replace partial data
    const id = source?._id || source?.id || (e && typeof e === 'object' && (typeof e.employeeId === 'string' ? e.employeeId : (typeof e.managerId === 'string' ? e.managerId : null)));
    if (id) {
      dispatch(get_user_by_id(id)).catch((err) => console.warn('get_user_by_id failed', err));
    }
  };

  // Fetch project applications when Applications tab is selected
  useEffect(() => {
    // Clear any open profile modal when switching tabs
    dispatch(clearSelectedUser());

    if (activeTab === 'Applications' && selectedProjectl && selectedProjectl._id) {
      dispatch(getProjectApplicationsById(selectedProjectl._id));
    }
  }, [activeTab, selectedProjectl, dispatch]);

  const handleApproveApplication = async (applicationId) => {
    if (!selectedProjectl || !selectedProjectl._id) return;
    try {
      await dispatch(approveProjectApplication({ projectId: selectedProjectl._id, applicationId }));
      // refresh applications and project details
      dispatch(getProjectApplicationsById(selectedProjectl._id));
      dispatch(getProjectById(selectedProjectl._id));
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const handleRejectApplication = async (applicationId) => {
    if (!selectedProjectl || !selectedProjectl._id) return;
    try {
      await dispatch(declineProjectApplication({ projectId: selectedProjectl._id, applicationId }));
      // refresh applications
      dispatch(getProjectApplicationsById(selectedProjectl._id));
    } catch (err) {
      console.error('Decline failed', err);
    }
  };

  const handleAddEmployee = () => {
    // guard clause: make sure both pieces are filled in
    if (!selectedOption || !position) return;

    // console.log("Selected option:", selectedOption);
    // console.log("Position:", position);

    // build the new employee record
    const newEmployees = {
      employeeId: selectedOption.id,
      name: selectedOption.label,
      email: selectedOption.email
    };
    const requestBody = { employees: [newEmployees] };

    const projectId = selectedProjectl._id;
    dispatch(addEmployeesToProject({ projectId, requestBody }));

    // clear the form
    setSelectedOption(null); // empties the <Select>
    setPosition(""); // clears the text field
  };

  const handleRemoveEmployee = async (e) => {
    const employeeId = e?.employeeId || e?._id || e?.id;
    const projectId = selectedProjectl?._id;
    console.log('handleRemoveEmployee called', { e, employeeId, projectId });
    if (!employeeId || !projectId) {
      console.warn('Cannot remove employee - missing employeeId or projectId', { e, selectedProjectl });
      return;
    }
    try {
      const result = await dispatch(removeEmployeesFromProject({ projectId, employeeId })).unwrap();
      console.log('remove employee result', result);
      // refresh project details to reflect removal
      dispatch(getProjectById(projectId));
    } catch (err) {
      console.error('remove employee failed', err);
      alert('Failed to remove employee. See console for details.');
    }
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
                  `${selectedProjectl.startDate.split("T")[0]} - ${selectedProjectl.endDate.split("T")[0] ?? "Ongoing"}`
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
                    <SkillsMultiSelect
          options={LANGUAGE_OPTIONS}
          value={editedProject.skillTags}      // already prefilled
          onChange={(next) =>
            setEditedProject({ ...editedProject, skillTags: next })
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
                    <strong>Email Id:</strong> <span>{m.email}</span>
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

            {/* selectedUser modal moved to global location below */}

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
                  <th>Email</th>
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
                    <td>{e.email}</td>
                    <td>{e.dateAdded.split("T")[0]}</td>
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

            {/* selectedUser modal moved to global location below */}

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

        {activeTab === 'Applications' && (
        <div className="project-modal fade-in">
          <h3 className="section-title">Pending Applications</h3>

          {(selectedProjectl?.applications && selectedProjectl.applications.filter(a => a.status === 'pending').length > 0) ? (
            selectedProjectl.applications.filter(a => a.status === 'pending').map((app, i) => (
              <div key={app._id || app.id || i} className="application-card">
                <div className="application-info">
                  <p className="applicant-label">{(app.employeeId && (app.employeeId.firstName || app.employeeId.firstName)) ? `${app.employeeId.firstName || ''} ${app.employeeId.lastName || ''}` : (app.name || app.firstName || 'Unknown')}</p>
                  <p className="applicant-sub">Role: {app.role || app.position || 'N/A'}</p>
                </div>
                <div className="application-actions">
                  <button className="view-btn" onClick={() => handleViewProfile(app.employeeId || app)}>
                    View Profile
                  </button>
                  <button className="approve-btn" onClick={() => handleApproveApplication(app._id || app.id)}>
                    Approve
                  </button>
                  <button className="reject-btn" onClick={() => handleRejectApplication(app._id || app.id)}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending applications for this project.</p>
          )}
        </div>
      )}

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


                        <label className="field-label">Project Name *</label>
                        <div>
                          <input {...register("title")} />
                          <p className="error-text">{errors.title?.message}</p>
                        </div>

                        <label className="field-label">Description *</label>
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

   <label className="field-label">Manager Name *</label>
                        <div>
                          <select
                            {...register("manager", {
                              required: "Manager is required",
                              setValueAs: (val) => {
                                const e = formattedManagerList.find(x => (x._id ?? x.id) === val);
                                return e ? { managerId: e._id ?? e.id, name: e.label, email:e.email } : null;
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






                        <label className="field-label">Start Date *</label>
                        <div>
                          <input type="date" {...register("startDate")} />
                          <p className="error-text">{errors.start?.message}</p>
                        </div>

                        <label className="field-label">End Date</label>
                        <input type="date" {...register("endDate")} />

                        <label className="field-label">Status</label>
                        <select {...register("status")}>
                          <option value="Active">Active</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Inactive">Inactive</option>
                        </select>

                        {/* <label>Skill Tags *</label>
                        <div>
                          <input {...register("skillTags")} />
                          <p className="error-text">{errors.skillTags?.message}</p>
                        </div> */}


<label className="field-label">Skill Tags *</label>
<div>
  <Controller
    name="skillTags"
    control={control}
    rules={{ 
      validate: (arr) => (Array.isArray(arr) && arr.length > 0) || "Pick at least one skill"
    }}
    render={({ field }) => (
      <SkillsMultiSelect
        options={LANGUAGE_OPTIONS}
        value={field.value || []}
        onChange={field.onChange}
      />
    )}
  />
  <p className="error-text">{errors.skillTags?.message}</p>
</div>

                        
                        

                        <label className="field-label">Client Name *</label>
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
                        <td>{project.startDate.split("T")[0]}</td>
                        <td>{project.endDate ? project.endDate.split("T")[0] : "Ongoing"}</td>
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

        {selectedUser && (
          <div className="modal-backdrop" onClick={() => dispatch(clearSelectedUser())}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Employee Profile</h3>
              <table className="profile-table">
                <tbody>
                  {Object.entries(selectedUser)
                    .filter(([key]) => !["_id", "__v", "acknowledgments"].includes(key))
                    .map(([key, value]) => (
                      <tr key={key}>
                        <td className="profile-label">{formatLabel(key)}</td>
                        <td className="profile-value">{formatValue(key, value)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="action-buttons">
                <button className="close-btn" onClick={() => dispatch(clearSelectedUser())}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Projects;
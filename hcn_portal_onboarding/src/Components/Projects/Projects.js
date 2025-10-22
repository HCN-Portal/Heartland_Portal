import React, { useState, useEffect } from "react";
import "./Projects.css";
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import Sidebar from "../Sidebar/Sidebar";
import Select from "react-select";
import axios from "axios";
import api from '../../api/api';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";



const Projects = () => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [overviewErrors, setOverviewErrors] = useState({});

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
    resolver: yupResolver(projectSchema),
  });


  // Projects - will be loaded from backend on mount
  const [projects, setProjects] = useState([]);

  // Manager static data for View Manager Details
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
        const response = await axios.get("http://localhost:5000/api/users/"); // Assuming this API fetches all users
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
  // profile loading / error states
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // include Applications tab so pending applications can be managed
  const tabs = ["Overview", "Managers", "Employees", "Applications"];

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
        {data ? (
          <table className="profile-table">
            <tbody>
              <tr>
                <td className="profile-label">Name</td>
                <td className="profile-value">{data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : (data.name || data.fullName || '')}</td>
              </tr>
              <tr>
                <td className="profile-label">Email</td>
                <td className="profile-value">{data.email || ''}</td>
              </tr>
              <tr>
                <td className="profile-label">Role</td>
                <td className="profile-value">{data.role || data.position || ''}</td>
              </tr>
              <tr>
                <td className="profile-label">Employee ID</td>
                <td className="profile-value">{data.employeeId || data.employeeID || ''}</td>
              </tr>
              <tr>
                <td className="profile-label">Phone</td>
                <td className="profile-value">{data.phoneNumber || data.phone || ''}</td>
              </tr>
              <tr>
                <td className="profile-label">Address</td>
                <td className="profile-value">{(data.address1 || '') + (data.address2 ? `, ${data.address2}` : '')}</td>
              </tr>
              {data.relevantSkills && (
                <tr>
                  <td className="profile-label">Skills</td>
                  <td className="profile-value">{Array.isArray(data.relevantSkills) ? data.relevantSkills.join(', ') : data.relevantSkills}</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p>No profile data available.</p>
        )}
        <div className="action-buttons">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Fetch a user profile from backend by userId (preferred) or email (fallback)
  const fetchUserProfile = async ({ userId, email }) => {
    try {
      if (userId) {
        const resp = await api.get(`/users/${userId}`);
        return resp.data;
      }

      // If no userId, try to fetch all users and match by email
      if (email) {
        const all = await api.get('/users');
        const users = all.data.users || all.data;
        const match = (users || []).find(u => u.email === email || `${u.firstName} ${u.lastName}`.trim() === email);
        if (match) return match;
      }

      return null;
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      return null;
    }
    
  };

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

  // Approve an application (frontend): call backend and update local state
  const handleApproveApplication = async (index) => {
    if (!selectedProject || !selectedProject.applications || !selectedProject.applications[index]) {
      alert('No application selected');
      return;
    }

    try {
      setProcessingAction(true);
      const application = selectedProject.applications[index];

      // If the project and application have backend IDs, call the backend.
      // For the static/demo project we use local state update.
      if (selectedProject._id && application._id) {
  await api.post(`/projects/${selectedProject._id}/applications/${application._id}/approve`);
        // After server confirms, refresh project from backend to stay in sync
        const fresh = await fetchProjectById(selectedProject._id);
        if (fresh) {
          // Fetch updated applications from backend and map to frontend shape
          const apps = await fetchProjectApplications(fresh._id);
          const mapped = {
            ...selectedProject,
            _id: fresh._id,
            id: fresh._id,
            name: fresh.title || selectedProject.name,
            description: fresh.description || selectedProject.description,
            managers: fresh.managers ? fresh.managers.map(m => ({ name: m.name, email: m.email || '' })) : selectedProject.managers,
            employees: fresh.teamMembers ? fresh.teamMembers.map(e => ({ name: e.name, position: 'Employee', date: '' })) : selectedProject.employees,
            applications: apps
          };
          setSelectedProject(mapped);
          setProjects((prev) => prev.map((p) => (p._id === fresh._id || p.id === fresh._id ? mapped : p)));
          alert('Application approved');
          return;
        }
      }

      // Local state update (works for demo/static data)
      let updatedProject = { ...selectedProject };

      if (application.position === 'Manager') {
        updatedProject.managers = [
          ...(updatedProject.managers || []),
          { name: application.name, email: `${application.name.toLowerCase()}@admin.hcn.com` },
        ];
      } else {
        updatedProject.employees = [
          ...(updatedProject.employees || []),
          { name: application.name, position: application.position || 'Employee', date: updatedProject.start },
        ];
      }

      updatedProject.applications = (updatedProject.applications || []).filter((_, i) => i !== index);
      setSelectedProject(updatedProject);
      setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));

  // If backend not used, local update already applied above; show success
  alert('Application approved');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to approve application';
      console.error('Approve failed', err);
      alert(`Failed to approve application: ${msg}`);
    } finally {
      setProcessingAction(false);
    }
  };

  // Fetch fresh project data from backend by _id and sync into state
  const fetchProjectById = async (projectId) => {
    try {
      const resp = await api.get(`/projects/${projectId}`);
      return resp.data;
    } catch (err) {
      console.error('Failed to fetch project by id', err);
      return null;
    }
  };

  // Fetch applications for a project from backend
  const fetchProjectApplications = async (projectId) => {
    try {
      const resp = await api.get(`/projects/${projectId}/applications`);
      const data = resp.data;
      const requests = data.requests || [];
      // Only keep pending requests (do not show approved/declined)
      const pending = requests.filter((r) => r.status === 'pending');
      // Map backend request objects to UI-friendly shape
      return pending.map((r) => ({
        _id: r._id,
        name: r.employeeId ? `${r.employeeId.firstName || ''} ${r.employeeId.lastName || ''}`.trim() : (r.name || ''),
        position: r.role === 'manager' ? 'Manager' : 'Employee',
        status: r.status,
        requestDetails: r.requestDetails || '',
        employeeId: r.employeeId ? r.employeeId._id || r.employeeId.id : undefined,
      }));
    } catch (err) {
      console.error('Failed to fetch project applications', err);
      return [];
    }
  };

  const handleViewProject = async (project) => {
    // If project has backend _id, fetch fresh data
    if (project._id) {
      const fresh = await fetchProjectById(project._id);
      if (fresh) {
        // Map backend fields to frontend shape expected by this component
        const mapped = {
          ...project,
          id: fresh._id,
          _id: fresh._id,
          name: fresh.title || project.name,
          description: fresh.description || project.description,
          managers: fresh.managers ? fresh.managers.map(m => ({ name: m.name, email: m.email || '', managerId: (m.managerId || m._id) })) : project.managers,
          employees: fresh.teamMembers ? fresh.teamMembers.map(e => ({ name: e.name, position: 'Employee', date: '', employeeId: (e.employeeId || e._id) })) : project.employees,
          skillTags: Array.isArray(fresh.skillTags) ? fresh.skillTags.join(', ') : (fresh.skillTags || ''),
          client: fresh.client || project.client || '',
          start: fresh.startDate ? (() => { const d = new Date(fresh.startDate); return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}` })() : 'N/A',
          end: fresh.endDate ? (() => { const d = new Date(fresh.endDate); return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}` })() : 'Ongoing'
        };

        // populate applications from backend
        const apps = await fetchProjectApplications(fresh._id);
        mapped.applications = apps;

        setSelectedProject(mapped);
        setActiveTab('Overview');
        // Also update projects list with any changed values
        setProjects(prev => prev.map(p => (p._id === fresh._id || p.id === fresh._id ? mapped : p)));
        return;
      }
    }

    // Fallback to local project object
    setSelectedProject(project);
    setActiveTab('Overview');
  };

  // Reject an application (frontend): call backend and update local state
  const handleRejectApplication = async (index) => {
    if (!selectedProject || !selectedProject.applications || !selectedProject.applications[index]) {
      alert('No application selected');
      return;
    }

    try {
      setProcessingAction(true);
      const application = selectedProject.applications[index];

      if (selectedProject._id && application._id) {
  await api.post(`/projects/${selectedProject._id}/applications/${application._id}/decline`, { responseNotes: 'Rejected via UI' });
        // refresh project from backend
        const fresh = await fetchProjectById(selectedProject._id);
        if (fresh) {
          // refresh applications list from backend
          const apps = await fetchProjectApplications(fresh._id);
          const mapped = {
            ...selectedProject,
            _id: fresh._id,
            id: fresh._id,
            name: fresh.title || selectedProject.name,
            description: fresh.description || selectedProject.description,
            managers: fresh.managers ? fresh.managers.map(m => ({ name: m.name, email: m.email || '' })) : selectedProject.managers,
            employees: fresh.teamMembers ? fresh.teamMembers.map(e => ({ name: e.name, position: 'Employee', date: '' })) : selectedProject.employees,
            applications: apps
          };
          setSelectedProject(mapped);
          setProjects((prev) => prev.map((p) => (p._id === fresh._id || p.id === fresh._id ? mapped : p)));
          alert('Application rejected');
          return;
        }
      }
      // fallback local update
      const updatedApplications = (selectedProject.applications || []).filter((_, i) => i !== index);
      const updatedProject = { ...selectedProject, applications: updatedApplications };

      setSelectedProject(updatedProject);
      setProjects((prev) => prev.map((p) => (p.id === selectedProject.id ? updatedProject : p)));

      alert('Application rejected');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to reject application';
      console.error('Reject failed', err);
      alert(`Failed to reject application: ${msg}`);
    } finally {
      setProcessingAction(false);
    }
  };

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

  // Helper: format backend date to display (MM/DD/YYYY)
  const formatBackendDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    try {
      const d = new Date(isoDate);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    } catch (e) {
      return isoDate;
    }
  };

  // Fetch all projects from backend and map to UI shape
  const fetchAllProjects = async () => {
    try {
      const res = await api.get('/projects');
      const data = res.data;
      // Backend returns { count, projects: [{ id, title }] } per controller.getAllProjectTitles
      const ids = (data.projects || []).map(p => p.id || p._id).filter(Boolean);

      // fetch full project documents in parallel
      const detailed = await Promise.all(ids.map(id => api.get(`/projects/${id}`).then(r => r.data).catch(() => null)));

      const items = detailed.filter(Boolean).map((fresh, i) => ({
        id: fresh._id || i + 1,
        _id: fresh._id,
        name: fresh.title || fresh.name,
        manager: (fresh.managers && fresh.managers[0] && fresh.managers[0].name) || 'Not Assigned',
        start: fresh.startDate ? formatBackendDate(fresh.startDate) : 'N/A',
        end: fresh.endDate ? formatBackendDate(fresh.endDate) : 'Ongoing',
        status: fresh.status || 'Active',
        description: fresh.description || '',
        managers: fresh.managers ? fresh.managers.map(m => ({ name: m.name, email: m.email || '' })) : [],
          employees: fresh.teamMembers ? fresh.teamMembers.map(e => ({ name: e.name, position: 'Employee', date: '', employeeId: (e.employeeId || e._id) })) : [],
        applications: [],
        skillTags: Array.isArray(fresh.skillTags) ? fresh.skillTags.join(', ') : (fresh.skillTags || ''),
        client: fresh.client || ''
      }));

      setProjects(items);
    } catch (err) {
      console.error('Failed to fetch projects', err);
      if (projects.length === 0) setProjects([]);
    }
  };

  useEffect(() => {
    fetchAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Renders Tabs Content and detailed modal view of selected project
  // console.log(projects)
  // Controlled form inputs for editing project overview
  // Validates using Yup before saving changes
  const renderDetail = () => (
  <div className="project-modal">
    <div className="dashboard-header">
      <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Project Details: {selectedProject.name}
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
                    onClick={async () => {
                      setProfileError(null);
                      setProfileLoading(true);
                      try {
                        const manager = m;
                        const userId = manager.managerId || manager.manager_id || null;
                        const profile = await fetchUserProfile({ userId, email: manager.email });
                        if (profile) setselectedManagerDetails(profile);
                        else {
                          console.warn('Manager profile not found, using fallback', manager);
                          setselectedManagerDetails({ ...managerStaticData, name: manager.name, email: manager.email });
                        }
                      } catch (err) {
                        console.error('View Profile (manager) error', err);
                        setProfileError('Failed to load manager profile');
                        setselectedManagerDetails(null);
                      } finally {
                        setProfileLoading(false);
                      }
                    }}
                  >
                    {profileLoading ? 'Loading...' : 'View Profile'}
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
            {profileError && (
              <div className="profile-error">{profileError}</div>
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
                        onClick={async () => {
                          setProfileError(null);
                          setProfileLoading(true);
                          try {
                            const userId = e.employeeId || e.employee_id || null;
                            const profile = await fetchUserProfile({ userId, email: e.email || e.name });
                            if (profile) setSelectedEmployee(profile);
                            else {
                              console.warn('Employee profile not found, using fallback', e);
                              setSelectedEmployee({ name: e.name, position: e.position, date: e.date });
                            }
                          } catch (err) {
                            console.error('View Profile (employee) error', err);
                            setProfileError('Failed to load employee profile');
                            setSelectedEmployee(null);
                          } finally {
                            setProfileLoading(false);
                          }
                        }}
                      >
                        {profileLoading ? 'Loading...' : 'View Profile'}
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
            {profileError && (
              <div className="profile-error">{profileError}</div>
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

        {activeTab === 'Applications' && (
        <div className="project-modal fade-in">
          <h3 className="section-title">Pending Applications</h3>

          {selectedProject.applications.map((app, i) => (
            <div key={i} className="application-card">
              <div className="application-info">
                <p className="applicant-label">{app.name} - {app.position}</p>
              </div>
              <div className="application-actions">
                <button className="view-btn" onClick={async () => {
                  setProfileError(null);
                  setProfileLoading(true);
                  try {
                    const appObj = selectedProject.applications[i];
                    const userId = appObj.employeeId || appObj.employee_id || null;
                    const profile = await fetchUserProfile({ userId, email: appObj.email || appObj.name });
                    if (profile) setSelectedEmployee(profile);
                    else {
                      console.warn('Application profile not found, using fallback', appObj);
                      setSelectedEmployee({ name: appObj.name, position: appObj.position });
                    }
                  } catch (err) {
                    console.error('View Profile (application) error', err);
                    setProfileError('Failed to load applicant profile');
                    setSelectedEmployee(null);
                  } finally {
                    setProfileLoading(false);
                  }
                }}>{profileLoading ? 'Loading...' : 'View Profile'}</button>
                <button className="approve-btn" disabled={processingAction} onClick={() => handleApproveApplication(i)}>Approve</button>
                <button className="reject-btn" disabled={processingAction} onClick={() => handleRejectApplication(i)}>Reject</button>
              </div>
            </div>
          ))}
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
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        
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
                    <th>Skill Tags</th>
                    <th>Client</th>
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
                        <td>{project.end ? project.end : "Ongoing"}</td>
                        <td>{project.skillTags}</td>
                        <td>{project.client}</td>
                        <td>{project.status}</td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => handleViewProject(project)}
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
        {/* Global ProfileModal rendered outside of tab content so it appears immediately */}
        {(selectedEmployee || selectedManagerDetails) && (
          <ProfileModal
            data={selectedEmployee || selectedManagerDetails}
            onClose={() => { setSelectedEmployee(null); setselectedManagerDetails(null); setProfileError(null); }}
            title="Profile Details"
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
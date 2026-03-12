import React, { useState, useEffect, useMemo } from "react";
import "../Projects/Projects.css";
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Sidebar from "../Sidebar/Sidebar";
import Select from "react-select";
import SkillsMultiSelect from "../SkillsMultiSelect";
import { useSelector, useDispatch } from "react-redux";
import {
  clearSelectedUser,
  get_user_by_id,
  setSelectedUser,
} from "../../store/reducers/userReducer";
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
  getProjectApplicationsByUserId,
  approveProjectApplication,
  declineProjectApplication,
} from "../../store/reducers/projectReducer";

const ProjectsManager = () =>{
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const [isEditingOverview, setIsEditingOverview] = useState(false);
    const [editedProject, setEditedProject] = useState(null);
    const [overviewErrors, setOverviewErrors] = useState({});
       const [projectView, setProjectView] = useState("My Projects");
       const [isProfileView, setIsProfileView] = useState(false);
     const [myProjects, setMyProjects] = useState([]);
    const dispatch = useDispatch();

       const { selectedUser ,managers: managersList} = useSelector(state => state.users);
        const authState = useSelector(state => state.auth);
        const { projects,selectedProjectl, employees, managers ,userApplications,currentProjectApplications} = useSelector((state) => state.projects);
    
    
 const [selectedProject, setSelectedProject] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [position, setPosition] = useState("");


    const LANGUAGE_OPTIONS = [
    "JavaScript","TypeScript","Python","Java","C#","C++","Go","Rust","PHP","Ruby",
    "Kotlin","Swift","Scala","Dart","R","SQL","Tableau","Power BI", "Mongo DB", "React", "Angular", "Node","Express" , "Spring Boot"
    ];

 useEffect(() => {
    // Get user info from Redux or localStorage
    const userInfo = authState.userInfo || JSON.parse(localStorage.getItem('userInfo'));
    // Debug log
    console.log(selectedUser,"dvgczb n")
    if (userInfo?.userId) {
    //   dispatch(get_user_by_id(userInfo.userId));
  dispatch(getAllProjectTitles());
   dispatch(getEmployees());
 
      }
  }, [dispatch]);
// useEffect(() => {
//     console.log(selectedUser,"kj,m n")
//         if (selectedUser?.projectsAssigned && projects?.length > 0) {
//             const assignedProjects = selectedUser.projectsAssigned
//                 .map(assignedProject => {
//                     const projectId = assignedProject.projectId;
//                     const project = projects.find(p => p._id === projectId);
//                     if (project) {
//                         return {
//                             id: project._id,
//                             title: project.title || project.projectName,
//                             startDate: new Date(project.startDate).toLocaleDateString(),
//                             endDate: new Date(project.endDate).toLocaleDateString(),
//                             status: project.status,
//                             description: project.description,
//                             managers: project.managers?.map(m => {
//                                 // Use managers array directly from state
//                                 const managerDetails = Array.isArray(managersList)
//                                     ? managersList.find(manager => manager.id === m.managerId)
//                                     : null;
//                                 return {
//                                     name: m.name,
//                                     email: managerDetails?.email || 'Email not available',
//                                     id: m.managerId
//                                 };
//                             }) || [],
//                             teamMembers: project.teamMembers?.map(t => ({
//                                 name: t.name,
//                                 position: t.role || 'Team Member',
//                                 date: t.joinDate ? new Date(t.joinDate).toLocaleDateString() : ''
//                             })) || [],
//                             client: project.client || 'N/A',
//                             skillTags: project.skillTags || []
//                         };
//                     }
//                     return null;
//                 })
//                 .filter(Boolean);
//             setMyProjects(assignedProjects);
//             setProjectsToDisplay(assignedProjects);
//         }
//     }, [ projects]); // Updated dependency to managersList
const [projectsToDisplay, setProjectsToDisplay] = useState();

useEffect(() => {
    const userInfo = authState.userInfo || JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !projects?.length) return;

    const filtered = projects
        .filter(project =>
            project.managers?.some(m => m.managerId === userInfo.userId)
        )
        .map(project => ({
            id: project._id,
            title: project.title || project.projectName,
            startDate: new Date(project.startDate).toLocaleDateString(),
            endDate: new Date(project.endDate).toLocaleDateString(),
            status: project.status,
            description: project.description,
            managers: project.managers?.map(m => {
                const managerDetails = Array.isArray(managersList)
                    ? managersList.find(manager => manager.id === m.managerId)
                    : null;

                return {
                    name: m.name,
                    id: m.managerId,
                    email: managerDetails?.email || "Email not available"
                };
            }) || [],
            teamMembers: project.teamMembers?.map(t => ({
                name: t.name,
                position: t.role || "Team Member",
                date: t.joinDate
                    ? new Date(t.joinDate).toLocaleDateString()
                    : ""
            })) || [],
            client: project.client || "N/A",
            skillTags: project.skillTags || [],
            pendingApplications:project.pendingApplications || 0
        }));

    setMyProjects(filtered);
    setProjectsToDisplay(filtered);
console.log(filtered,"myprojrcts")
}, [projects, managersList]);





// Pagination setup
const projectsPerPage = 5; // state/prop
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.max(1, Math.ceil(myProjects.length / projectsPerPage));
const indexOfFirstProject = (currentPage - 1) * projectsPerPage;
const indexOfLastProject = indexOfFirstProject + projectsPerPage;

// keep local list in sync with source
useEffect(() => {
//   setCurrentPage(1); 
}, [myProjects,projectsToDisplay,isProfileView]);

// compute the current slice whenever data or page changes
const currentProjects =  myProjects.slice(indexOfFirstProject, indexOfLastProject)

useEffect(() => {
  if (currentPage > totalPages) setCurrentPage(totalPages);
}, [currentPage, totalPages]);

// Combined UseEffect for proper render after prop update.
useEffect ( ()=>{
    console.log(currentProjectApplications)
},[currentProjects,currentProjectApplications]);
 useEffect(() => {
  }, [selectedProjectl]);


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

    const tabs = ["Overview", "Managers", "Employees", "Applications"];

      const handleEachProject = (projectId) => {
        console.log(projectId,"fduygbhn c")
        dispatch(getProjectById(projectId));
        dispatch(getProjectApplicationsById(projectId))
      };
    const handleViewProfile = (e) => {
       // Build a local user object from whatever fields are available so modal appears immediately
    //    const maybeNested = e && typeof e === 'object' && (e.employeeId || e.managerId) ? (e.employeeId && typeof e.employeeId === 'object' ? e.employeeId : (e.managerId && typeof e.managerId === 'object' ? e.managerId : null)) : null;
    //    const source = maybeNested || e;
   
    //    const localUser = {
    //      firstName: source?.firstName || source?.name?.split?.(' ')?.[0] || '',
    //      lastName: source?.lastName || (source?.name ? source.name.split(' ').slice(1).join(' ') : ''),
    //      preferredName: source?.preferredName || '',
    //      email: source?.email || '',
    //      employeeId: source?._id || source?.id || source?.employeeId || source?.managerId || '',
    //      projectsAssigned: source?.projectsAssigned || [],
    //    };
   
    //    // Show quick modal immediately
    //    dispatch(setSelectedUser(localUser));
   
       // If we have an id, fetch full profile to replace partial data
       const id = e?._id || e?.id || (e && typeof e === 'object' && (typeof e.employeeId === 'string' ? e.employeeId : (typeof e.managerId === 'string' ? e.managerId : null)));
       console.log(id,"in view profile id")
       if (id) {
         dispatch(get_user_by_id(id)).catch((err) => console.warn('get_user_by_id failed', err));
       }
       setIsProfileView(true)
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
          email: selectedOption.email
        };
        const requestBody = { employees: [newEmployees] };
    
        const projectId = selectedProjectl._id;
        // dispatch(addEmployeesToProject({ projectId, requestBody }));

        alert("Employee Added function will be added")
    
        // clear the form
        setSelectedOption(null); // empties the <Select>
        setPosition(""); // clears the text field
    };
    
    const handleRemoveEmployee = (e) => {
        const employeeId = e.employeeId;
        const projectId = selectedProjectl._id;
        // dispatch(removeEmployeesFromProject({ projectId, employeeId }));
        alert("Employee Remove function will be added")
    };

    
    const handleProjectViewChange = (view) => {
        setProjectView(view);

        if (view === "Pending Requests") {
            setProjectsToDisplay(myProjects); //chanhgeeeeee thisss
        }
        else {
            setProjectsToDisplay(myProjects);
        }
    };

  
    
   
   

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

    const handleApproveApplication = (i) =>{
        alert("Application Approved ", i)
    }

     const handleRejectApplication = (i) =>{
        alert("Application Rejected ", i)
    }

    const renderPendingRequests = () =>(
        <div>

        </div>
    )

    const renderDetail = () => (
        <div className="project-modal">
        <div className="dashboard-header">
            <button
            className="close-btn"
            onClick={() => {
                if (isEditingOverview) {
                alert("Please save your changes before closing.");
                } else {
                dispatch(clearSelectedProject());
                // {setSelectedUser(null)}
                // dispatch(clearSelectedUser())
                {setSelectedProject(null)}

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
                    // `${selectedProjectl.startDate.split("T")[0]} - ${selectedProjectl.endDate.split("T")[0] ?? "Ongoing"}`
                    `${selectedProjectl.startDate} - ${selectedProjectl.endDate ?? "Ongoing"}`
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
                        <td>tbd</td>
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

             {currentProjectApplications?currentProjectApplications.filter((application)=> application.status=='pending').map((app, i) => (
              <div key={app._id || app.id || i} className="application-card">
                <div className="application-info">
                  <p className="applicant-label">
                    {(app.employeeId && (app.employeeId.firstName || app.employeeId.firstName)) ? `${app.employeeId.firstName || ''} ${app.employeeId.lastName || ''}` : (app.name || app.firstName || 'Unknown')}</p>
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
            )) : (<p>No pending applications for this project.</p>)
            }
        </div>
      )}
            
            {/* {activeTab === 'Updates/Activity' && <p>No activity yet.</p>} */}
        </div>
        </div>
    );


    return(
        <div>
            <NavigationBar isLoggedIn="true" />
            <div className="admin-dashboard">
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            
            <main className="pending-main">
                
                {!selectedProjectl ? (
                    <>
                    <div className="dashboard-header">
                        <h2 className="pending-title">{projectView}</h2>
                        
                        <div className="project-tabs">
                        {["My Projects"].map((view) => (
                            <button
                            key={view}
                            className={`tab-button ${projectView === view ? 'active-tab' : ''}`}
                            // onClick={() => handleProjectViewChange(view)}
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
                                {/* <td>{project.startDate.split("T")[0]}</td>
                                <td>{project.endDate ? project.endDate.split("T")[0] : "Ongoing"}</td> */}
                                <td>{project.startDate}</td>
                                <td>{project.endDate ? project.endDate : "Ongoing"}</td>
                                <td>{project.status}</td>
                                <td>
                                <button
                                    className="view-btn"
                                    onClick={() => {
                                    handleEachProject(project?.id);
                                    setSelectedProject(project);
                                    setActiveTab("Overview");
                                    }}
                                >
                                    View Project
                                </button>
                                <button
                                    className="view-btn pending-btn"
                                    onClick={() => {
                                    handleEachProject(project?.id);
                                    setSelectedProject(project);
                                    setActiveTab("Applications"); // new tab for pending requests
                                    }}
                                >
                                            Pending Requests
                                            {project.pendingApplications >0 && (
                                                <span className="badge">{project.pendingApplications}</span>
                                            )}
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

                    </>):(
                        <>
                        <hr />
                        <h2>Selected Project Details</h2>
                        {renderDetail()}
                        </>
                    )
                }
            </main>
            {isProfileView && selectedUser && (
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
}


export default ProjectsManager
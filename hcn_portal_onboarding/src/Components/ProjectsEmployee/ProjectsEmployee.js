import React, { useState, useEffect,useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProjectTitles, getProjectById, get_all_projects } from "../../store/reducers/projectReducer";
import { get_user_by_id, get_all_managers } from "../../store/reducers/userReducer";
import {getProjectApplicationsByUserId , applyToJoinProject , approveProjectApplication, declineProjectApplication} from '../../store/reducers/projectReducer';
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

    const { selectedUser } = useSelector(state => state.users);
    const { managers: managersList } = useSelector(state => state.users); // Rename to managersList for clarity
    const authState = useSelector(state => state.auth);
    const { projects,selectedProjectl, employees, managers ,userApplications,currentProjectApplications} = useSelector((state) => state.projects);

    const [projectStatus , setProjectStatus] = useState("Available");

  useEffect(() => {
    // Get user info from Redux or localStorage
    const userInfo = authState.userInfo || JSON.parse(localStorage.getItem('userInfo'));
    // Debug log
    if (userInfo?.userId) {
      dispatch(get_user_by_id(userInfo.userId));
      dispatch(get_all_projects()); // Fetch all projects when component mounts
      dispatch(get_all_managers()); // Fetch all managers
      dispatch(getProjectApplicationsByUserId(userInfo.userId));
      dispatch(getAllProjectTitles());
    }
  }, [dispatch, authState.userInfo]);

    useEffect(() => {
        if (selectedUser?.projectsAssigned && projects?.length > 0) {
            const assignedProjects = selectedUser.projectsAssigned
                .map(assignedProject => {
                    const projectId = assignedProject.projectId;
                    const project = projects.find(p => p._id === projectId);
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
                                position: t.role || 'Team Member',
                                date: t.joinDate ? new Date(t.joinDate).toLocaleDateString() : ''
                            })) || [],
                            client: project.client || 'N/A',
                            skillTags: project.skillTags || []
                        };
                    }
                    return null;
                })
                .filter(Boolean);
            setMyProjects(assignedProjects);
            setProjectsToDisplay(assignedProjects);
        }
    }, [selectedUser, projects, managersList]); // Updated dependency to managersList



const requestedProjects = useMemo(() => {
  return (userApplications || []).filter(
    (req) => (req.status || req.requestStatus || "").toLowerCase() === "pending"
  );
}, [userApplications]);


useEffect(() => {
}, [userApplications, requestedProjects]);

const allProjects = projects
const [projectsToDisplay, setProjectsToDisplay] = useState(myProjects);

// Pagination setup
const projectsPerPage = 5; // state/prop
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.max(1, Math.ceil(projectsToDisplay.length / projectsPerPage));
const indexOfFirstProject = (currentPage - 1) * projectsPerPage;
const indexOfLastProject = indexOfFirstProject + projectsPerPage;

// keep local list in sync with source
useEffect(() => {
  setProjectsToDisplay(myProjects || []);
  setCurrentPage(1); 
}, [myProjects]);

// compute the current slice whenever data or page changes
const currentProjects = useMemo(
  () => projectsToDisplay.slice(indexOfFirstProject, indexOfLastProject),
  [projectsToDisplay, indexOfFirstProject, indexOfLastProject]
);

// if currentPage is out of range after data changes, clamp it
useEffect(() => {
  if (currentPage > totalPages) setCurrentPage(totalPages);
}, [currentPage, totalPages]);

// Combined UseEffect for proper render after prop update.
useEffect ( ()=>{
},[currentProjects , selectedProject,projectStatus]);
useEffect ( ()=>{
},[requestedProjects]);
// Essential Handle Functions
// set projects to be displayed based on Tab
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
         setCurrentPage(1); 
    };
// Send Request to backend api
    const handleRequest = () => {

        const confirmSend = window.confirm("Are you sure you want to send this request?");
  if (!confirmSend) return;


        const projectId = selectedProject._id;
        const requestBody = {
            employeeId : selectedUser._id,
            requestDetails : "I want to apply for this project due to xyz reasons"
        }
        getProjectStatus(projectId)
        dispatch(applyToJoinProject({projectId,requestBody}))
        alert("Request has been sent successfully!");
       
    };

// Check status of Project ...Joined/Requested/Available
    const getProjectStatus = (projectId) => {
        if (myProjects.some((p) => p.id === projectId)) {
            setProjectStatus("Joined");
            return "Joined";
        }
        if (requestedProjects.some((p) => p.projectId.id === projectId)) {
            setProjectStatus("Requested");
            return "Requested";
        }
        setProjectStatus("Available");
        return "Available";
    };

// Extract projectId from request since request structure is different from project structure
const getProjectIdOfRequest = (request) => request?.projectId?._id;


// is this project already requested by the current user?
const isProjectRequested = (projId) => {
  const pid = String(projId ?? "");
  return (requestedProjects || []).some((req) => {
    const reqPid = getProjectIdOfRequest(req); // handles { _id }, { id }, or string
    return String(reqPid ?? "") === pid;
  });
};

// has the user already joined this project?
const isProjectJoined = (projId) => {
  const pid = String(projId ?? "");
  return (myProjects || []).some((p) => String((p._id ?? p.id)) === pid);
};

// one-stop status get status of project...currently requested/joined by user?
const getRelationship = (projId) => {
  if (isProjectJoined(projId)) return "joined";
  if (isProjectRequested(projId)) return "requested";
  return "available";
};
// fn for setting view project under requested projects tab
const openRequest = (request) => {
  const projectId = request.projectId._id
  // filter the request's projectId and match with allProjects
  const project =  allProjects.find(project => project._id === projectId) || null;
  setSelectedProject(project)

}

// Case Table view for each tab.
function TableForView({ projectView, currentProjects, openProject, getProjectStatus, projectStatus }) {
  switch (projectView) {
    case "My Projects":
      return (
        <table className="applicant-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Project Name</th>
              <th>Manager</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((p, i) => (
              <tr key={p._id || i}>
                <td>{indexOfFirstProject + i + 1}</td>
                <td>{p.title}</td>
                <td>{p.managers && p.managers[0]? p.managers[0].name : "None"}</td>
                <td>{p.startDate? p.startDate.split('T')[0] : "-"}</td>
                <td>{p.endDate ? p.endDate.split('T')[0] : "Ongoing"}</td>
                <td>{p.status}</td>
                <td>
                  <button className="view-btn" onClick={() =>  openProject(p)}>
                    View Project
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "Requested Projects":
      return (
        <table className="applicant-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Project Name</th>
              <th>Manager</th>
              <th>Requested On</th>
              <th>Request Status</th>
              <th>Action</th>
              
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((p, i) => (
              <tr key={p._id || i}>
                <td>{indexOfFirstProject + i + 1}</td>
                <td>{p.projectId?.title ?? p.title}</td>
                <td>{p.projectId?.managers?.[0]?.name ?? "None"}</td>
                <td>{p.requestDate?.split("T")[0] ?? "—"}</td>
                <td>{p.status ?? "Pending"}</td>
                <td>
                  <button className="view-btn" onClick={() => openRequest(p)}>
                    View Project
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "All Projects":
    default:
      return (
        <table className="applicant-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Project</th>
              <th>Manager</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((p, i) => (
              <tr key={p._id || i}>
                <td>{indexOfFirstProject + i + 1}</td>
                <td>{p.title ?? p.projectId?.title}</td>
                <td>{p.managers?.[0]?.name ?? "None"}</td>
                <td>{p.startDate.split('T')[0] ?? "-"}</td>
                <td>{p.endDate.split('T')[0] ?? "Ongoing"}</td>
                <td>{p.status}</td>
                <td>
                  {projectView === "All Projects" ? (
                    projectStatus === "Available" ? (
                      <button className="view-btn" onClick={() => openProject(p)}>
                        View Project
                      </button>
                    ) : (
                      <div className={`status-label ${getProjectStatus(p._id).toLowerCase()}`}>
                        <span>{getProjectStatus(p._id)}</span>
                      </div>
                    )
                  ) : (
                    <button className="view-btn" onClick={() => openProject(p)}>
                      View Project
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}



    const renderDetail = () => (
        <div className="project-modal">
           <div className="dashboard-header">
  <button className="close-btn" onClick={() => setSelectedProject(null)}>Close</button>

  {(() => {
    // decide based on actual relationship, not only the tab
    const rel = getRelationship(selectedProject?._id ?? selectedProject?.id);
    
    if (rel === "joined") {
      return <h3 className="status-label joined"> Joined </h3>;
    }
    if (rel === "requested") {
      return <h3 className="status-label requested"> Requested! </h3>;
    }
    // available → show send request button
    return (
      <button className="close-btn" onClick={handleRequest}>
        Send Request
      </button>
    );
  })()}
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
                            <div className="project-value"> {`${selectedProject.startDate.split('T')[0]} - ${selectedProject.endDate.split('T')[0] ?? "Ongoing"}`} </div>
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
                                        <td>Team Member</td>
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
    

                            <TableForView
                                projectView={projectView}
                                currentProjects={currentProjects}
                                openProject={(project) => {
                                    setSelectedProject(project);
                                    setActiveTab("Overview");
                                }}
                                getProjectStatus={getProjectStatus}
                                projectStatus={projectStatus}
                            />



                    <div className="pagination-controls">

                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="page-btn">Prev</button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="page-btn">Next</button>


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


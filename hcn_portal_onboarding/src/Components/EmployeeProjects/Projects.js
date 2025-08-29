// components/EmployeeProjects/Projects.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Projects.css';
import Sidebar from '../Sidebar/Sidebar';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import { get_all_projects, get_project_details } from '../../store/reducers/projectReducer';
import { get_user_by_id } from '../../store/reducers/userReducer';

const ITEMS_PER_PAGE = 3;

const Projects = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { selectedUser } = useSelector(state => state.user);
  const { projects, loading } = useSelector(state => state.project);
  const userInfo = useSelector(state => state.auth.userInfo);

  useEffect(() => {
    // Get userInfo from localStorage if not in Redux
    const storedUserInfo = userInfo || JSON.parse(localStorage.getItem('userInfo'));

    // Fetch both projects and user data
    dispatch(get_all_projects());

    if (storedUserInfo?.userId) {
      dispatch(get_user_by_id(storedUserInfo.userId));
    }
  }, [dispatch]); // Remove userInfo from dependencies to prevent re-fetching

  // Debug logs
  useEffect(() => {
    console.log('Selected User:', selectedUser);
    console.log('Projects:', projects);
    console.log('UserInfo:', userInfo || JSON.parse(localStorage.getItem('userInfo')));
  }, [selectedUser, projects, userInfo]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const getAssignedProjects = async () => {
    if (!selectedUser?.projectsAssigned || !projects) {
      console.log('No projects or assigned projects found');
      return [];
    }

    try {
      // Fetch detailed information for each assigned project
      const projectPromises = selectedUser.projectsAssigned.map(async (assigned) => {
        try {
          // Dispatch the action to get project details
          const projectDetails = await dispatch(get_project_details(assigned.projectId)).unwrap();

          if (projectDetails) {
            return {
              ...projectDetails,
              title: assigned.title || projectDetails.title
            };
          }
          console.log('Could not find project details for:', assigned.projectId);
          return null;
        } catch (error) {
          console.error('Error fetching project details:', error);
          return null;
        }
      });

      // Wait for all project details to be fetched
      const detailedProjects = await Promise.all(projectPromises);

      // Filter out null values and apply search filter
      return detailedProjects
        .filter(Boolean)
        .filter(project => project.title.toLowerCase().includes(searchTerm));

    } catch (error) {
      console.error('Error in getAssignedProjects:', error);
      return [];
    }
  };

  // Update to handle async getAssignedProjects
  useEffect(() => {
    const loadProjects = async () => {
      if (activeTab === 'assigned') {
        const projects = await getAssignedProjects();
        setFilteredProjects(projects);
      }
    };

    loadProjects();
  }, [activeTab, selectedUser, searchTerm]);

  // Add state for filtered projects
  const [filteredProjects, setFilteredProjects] = useState([]);

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  return (
    <div>
      <NavigationBar isLoggedIn={true} />
      <div className="employee-dashboard">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-main">
          <h1>My Projects</h1>

          <div className="project-tabs">
            <button className={activeTab === 'assigned' ? 'active' : ''} onClick={() => setActiveTab('assigned')}>Assigned Projects</button>
            <button className={activeTab === 'completed' ? 'active' : ''} onClick={() => setActiveTab('completed')}>Completed Projects</button>
            <button className={activeTab === 'request' ? 'active' : ''} onClick={() => setActiveTab('request')}>Request Projects</button>
          </div>

          <div className="project-search">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="project-content">
            {loading ? (
              <div className="loading">Loading projects...</div>
            ) : (
              activeTab === 'assigned' && (
                <div className="project-list">
                  {paginatedProjects.length > 0 ? (
                    <>
                      {paginatedProjects.map((project, index) => (
                        <div key={project.id || `project-${index}`} className="project-card">
                          <h3>{project.title}</h3>
                          <p><strong>Client:</strong> {project.client}</p>
                          <p><strong>Duration:</strong> {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</p>
                          <p><strong>Status:</strong> {project.status}</p>
                          <p className="project-description">{project.description}</p>
                          <button className="view-details-btn">View Details</button>
                        </div>
                      ))}
                      {totalPages > 1 && (
                        <div className="pagination">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={currentPage === i + 1 ? 'active' : ''}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="no-projects">No projects assigned yet.</p>
                  )}
                </div>
              )
            )}

            {activeTab === 'completed' && <p>Completed Projects List Here</p>}
            {activeTab === 'request' && <p>Available Projects to Request Here</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;

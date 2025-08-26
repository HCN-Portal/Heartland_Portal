// components/EmployeeProjects/Projects.js

import React, { useState } from 'react';
import './Projects.css';
import Sidebar from '../Sidebar/Sidebar';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

const dummyProjects = [
  {
    id: 1,
    title: 'karunakar',
    manager: 'HCN Manager',
    duration: 'Jan 2024 - Mar 2024',
    status: 'Active',
    description: 'Project assigned to me ',
  },
  {
    id: 2,
     title: 'karunakar',
    manager: 'HCN Manager',
    duration: 'Jan 2024 - Mar 2024',
    status: 'Active',
    description: 'Project assigned to me ',
  },
  {
    id: 3,
     title: 'karunakar',
    manager: 'HCN Manager',
    duration: 'Jan 2024 - Mar 2024',
    status: 'Active',
    description: 'Project assigned to me ',
  },
  {
    id: 4,
    title: 'karunakar',
    manager: 'HCN Manager',
    duration: 'Jan 2024 - Mar 2024',
    status: 'Active',
    description: 'Project assigned to me ',
  },
  {
    id: 5,
    title: 'karunakar',
    manager: 'HCN Manager',
    duration: 'Jan 2024 - Mar 2024',
    status: 'Active',
    description: 'Project assigned to me ',
  },
  {
    id: 6,
   title: 'karunakar',
    manager: 'HCN Manager',
    duration: 'Jan 2024 - Mar 2024',
    status: 'Active',
    description: 'Project assigned to me ',
  },
];

const ITEMS_PER_PAGE = 3;

const Projects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value.toLowerCase());
  //   setCurrentPage(1); // reset to page 1 on search
  // };

  const filteredProjects = dummyProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm)
  );

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

          {/* <div className="project-search">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div> */}

          <div className="project-content">
            {activeTab === 'assigned' && (
              <div className="project-list">
                {paginatedProjects.map(project => (
                  <div key={project.id} className="project-card">
                    <h3>{project.title}</h3>
                    <p><strong>Assigned By:</strong> {project.manager}</p>
                    <p><strong>Duration:</strong> {project.duration}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                    <p>{project.description}</p>
                    <button className="view-details-btn">View Details</button>
                  </div>
                ))}
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
              </div>
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

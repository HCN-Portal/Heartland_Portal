// EmployeeLayout.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EmployeeLayout.css'; // Include styles for the layout

const EmployeeLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="employee-layout">
      <button
        className="toggle-sidebar-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar"
      />

      {sidebarOpen ? (
        <aside className="sidebar">
          <div className="sidebar-header">
            <button
              className="toggle-sidebar-btn-inside"
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse Sidebar"
            >
              &#9776;
            </button>
            <h2 className="sidebar-title">Heartland Community Network</h2>
          </div>

          <nav className="sidebar-nav">
            <ul>
              <li><Link to="/employee/home" className="active-link">Home</Link></li>
              <li><Link to="/employee/profile">Profile</Link></li>
              <li><Link to="/employee/projects">Projects</Link></li>
              <li><Link to="/employee/clockify">Clockify Tracker</Link></li>
              <li><Link to="/employee/help">Request Help</Link></li>
            </ul>
          </nav>
        </aside>
      ) : (
        <div className="collapsed-sidebar">
          <div className="collapsed-top">
            <button
              className="toggle-sidebar-btn-collapsed"
              onClick={() => setSidebarOpen(true)}
              aria-label="Expand Sidebar"
            >
              &#9776;
            </button>
          </div>
        </div>
      )}

      <main className="dashboard-main">
        {children} {/* This will render the page content */}
      </main>
    </div>
  );
};

export default EmployeeLayout;

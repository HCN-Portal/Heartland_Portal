import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './AdminLayout.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      <NavigationBar isLoggedIn={true} />
      <div className="admin-dashboard">
        {sidebarOpen ? (
          <aside className="sidebar">
            <div className="sidebar-header">
              <button
                className="toggle-sidebar-btn-inside"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                &#9776;
              </button>
              <h2 className="sidebar-title">Heartland Community Network</h2>
            </div>
            <nav className="sidebar-nav" aria-label="Admin navigation">
              <ul>
                <li>
                  <NavLink to="/admin/home" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/pending" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Pending Applications
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/employees" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Active Employees
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Projects
                  </NavLink>
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
                aria-label="Open sidebar"
              >
                &#9776;
              </button>
            </div>
          </div>
        )}

        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

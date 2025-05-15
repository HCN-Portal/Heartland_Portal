// Components/Sidebar/Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, toggleSidebar, activePath }) => {
  const location = useLocation();

  const links = [
    { to: '/employee/home', label: 'Employee Home' },
    { to: '/employee/profile', label: 'Profile' },
    { to: '/employee/projects', label: 'Projects' },
    { to: '/employee/clockify', label: 'Clockify' },
    { to: '/employee/help', label: 'Help' },
  ];

  return sidebarOpen ? (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="toggle-sidebar-btn-inside" onClick={toggleSidebar}>
          &#9776;
        </button>
        <h2 className="sidebar-title">Heartland Community Network</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? 'active-link' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  ) : (
    <div className="collapsed-sidebar">
      <div className="collapsed-top">
        <button className="toggle-sidebar-btn-collapsed" onClick={toggleSidebar}>
          &#9776;
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

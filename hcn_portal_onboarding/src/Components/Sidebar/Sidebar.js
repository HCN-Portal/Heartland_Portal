// Components/Sidebar/Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Sidebar.css';


const Sidebar = ({ sidebarOpen, toggleSidebar, activePath }) => {
  const location = useLocation();
  // const { userInfo } = useSelector((state) => state.auth);
  // console.log(userInfo);

  const employeeLinks = [
    { to: '/employee/home', label: 'Employee Home' },
    { to: '/employee/profile', label: 'Profile' },
    { to: '/employee/projects', label: 'Projects' },
    { to: '/employee/clockify', label: 'Clockify' },
    { to: '/employee/help', label: 'Help' },
  ];

  const adminLinks = [
    { to: '/admin/home', label: 'Home / Dashboard'},
    { to: '/admin/pending', label: 'Pending Applications' },
    { to: '/admin/employees', label: 'Employees' },
    { to: '/admin/projects', label: 'Projects' },
  ];

  const links = location.pathname.startsWith('/admin') ? adminLinks : employeeLinks;

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

import React, { useState, useEffect } from 'react';
import './EmployeeDashboard.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';


const EmployeeDashboard = () =>{

const [sidebarOpen, setSidebarOpen] = useState(true);

return(

    <div>
        <NavigationBar isLoggedIn= 'ture' />
    
    <div className="employee-dashboard">
        <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        </button>

        {sidebarOpen ? (
          <aside className="sidebar">
            <div className="sidebar-header">
              <button className="toggle-sidebar-btn-inside" onClick={() => setSidebarOpen(false)}>
                &#9776;
              </button>
              <h2 className="sidebar-title">Heartland Community Network</h2>
            </div>

            <nav className="sidebar-nav">
              <ul>
                <li><a href="/employee/home"style={{ fontWeight: "900" }}>Employee Home</a></li>
                <li><a href="/employee/profile" >Profile</a></li>
                <li><a href="#project">Project Details</a></li>
                <li><a href="#Timesheets">Timesheets</a></li>
              </ul>
            </nav>
          </aside>
        ) : (
          <div className="collapsed-sidebar">
            <div className="collapsed-top">
              <button className="toggle-sidebar-btn-collapsed" onClick={() => setSidebarOpen(true)}>
                &#9776;
              </button>
            </div>
          </div>
        )}

      <main className="dashboard-main">

        <div className="employee-header">
          <h1>Employee Dashboard - "placeholder Employee Name"</h1>
        </div>

        <div className="summary-cards-employee">
          <div className="card">
            <h3>Projects count</h3>
            <p className="card-number">2</p>
          </div>
          <div className="card">
            <h3>No. of Hours Worked this week</h3>
            <p className="card-number">32</p>
          </div>
        </div>
      </main>
    </div>
    </div>

    );
};


export default EmployeeDashboard;
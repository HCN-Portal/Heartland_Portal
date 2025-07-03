import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar'
import { get_dashboard_stats } from '../../store/reducers/appReducer';
import { useDispatch, useSelector } from 'react-redux';




const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingApplications, activeEmployees, ongoingProjects } = useSelector((state) => state.application);

  useEffect(() => {
    dispatch(get_dashboard_stats());
  }, [dispatch]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
        <NavigationBar isLoggedIn= 'ture' />
    
    <div className="admin-dashboard">
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
                <li><a href="/admin/home"style={{ fontWeight: "900" }}>Home / Dashboard</a></li>
                <li><a href="/admin/pending" >Pending Applications</a></li>
                <li><a href="/admin/employees">Active Employees</a></li>
                <li><a href="/admin/projects">Projects</a></li>
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

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Secondary Header */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          {/* <button className="signout-btn">Sign Out</button> */}
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <h3>Pending Applications</h3>
            <p className="card-number">{pendingApplications}</p>
          </div>
          <div className="card">
            <h3>Active Employees</h3>
            <p className="card-number">{activeEmployees}</p>
          </div>
          <div className="card">
            <h3>Ongoing Projects</h3>
            <p className="card-number">{ongoingProjects}</p>
          </div>
        </div>

       {/* Section Descriptions */}
        {/* <div className="section-links">
        <div className="section-item">
            <h3>Pending Applications</h3>
            <p>
            Please view the pending applications and Approve or Reject candidates.
            </p>
        </div>

        <div className="section-item">
            <h3>Active Employees </h3>
            <p>
            All the employees present in the company with their profile details.
            </p>
        </div>

        <div className="section-item">
            <h3>Ongoing Projects </h3>
            <p>
            All the projects which are currently ongoing and their team details.
            </p>
        </div>
        </div> */}


      </main>
    </div>
    </div>
  );
};

export default AdminDashboard;

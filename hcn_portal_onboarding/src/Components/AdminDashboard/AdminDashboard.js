import React from 'react';
import './AdminDashboard.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

const AdminDashboard = () => {
  return (
    <div>
        <NavigationBar />
    
    <div className="admin-dashboard">
        
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Heartland Community Network</h2>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/admin/home" style={{ fontWeight: "900" }}>Home / Dashboard</a></li>
            <li><a href="/admin/pending">Pending Applications</a></li>
            <li><a href="#employees">Active Employees</a></li>
            <li><a href="#projects">Projects</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Secondary Header */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button className="signout-btn">Sign Out</button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <h3>Pending Applications</h3>
            <p className="card-number">32</p>
          </div>
          <div className="card">
            <h3>Active Employees</h3>
            <p className="card-number">430</p>
          </div>
          <div className="card">
            <h3>Ongoing Projects</h3>
            <p className="card-number">12</p>
          </div>
        </div>

       {/* Section Descriptions */}
        <div className="section-links">
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
        </div>


      </main>
    </div>
    </div>
  );
};

export default AdminDashboard;

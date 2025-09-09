import React, { useState } from 'react';
import './EmployeeDashboard.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import Sidebar from '../Sidebar/Sidebar';
import { get_user_by_id } from '../../store/reducers/userReducer';

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
// const [user] = useSelector(dispatch(get_user_by_id))
  return (
    <div>
      <NavigationBar isLoggedIn={true} />
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="employee-dashboard">
        
        <main className="dashboard-main">
          <div className="employee-header">
            <h1>Employee Dashboard - "Employee Name"</h1>
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

// components/EmployeeClockify/Clockify.js

import React, { useState } from 'react';
import './ClockifyPage.css';
import Sidebar from '../Sidebar/Sidebar';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

const Clockify = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      <NavigationBar isLoggedIn={true} />
      <div className="employee-dashboard">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-main">
          <h1>Clockify Tracker</h1>

          <div className="clockify-widget">
            <h2>Clock In / Out</h2>
            <button onClick={() => window.open('https://app.clockify.me/tracker', '_blank')}>
              Start Timer in Clockify
            </button>
          </div>

          <div className="clockify-widget">
            <h2>View Timesheet</h2>
            <button onClick={() => window.open('https://app.clockify.me/reports/summary', '_blank')}>
              View Timesheet
            </button>
          </div>

          <p className="clockify-note">
            * Please ensure you're logged in with your company email on Clockify.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Clockify;

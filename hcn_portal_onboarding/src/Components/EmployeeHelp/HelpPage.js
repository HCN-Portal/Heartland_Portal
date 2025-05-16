// components/EmployeeHelp/HelpPage.js

import React, { useState } from 'react';
import './HelpPage.css';
import Sidebar from '../Sidebar/Sidebar';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

const HelpPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      <NavigationBar isLoggedIn={true} />
      <div className="employee-dashboard">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-main">
          <h1>Request Help</h1>

          <section className="help-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <p>If you need assistance, feel free to reach out:</p>
              <ul>
                <li><strong>Email:</strong> heartland@hcn.com</li>
                <li><strong>Phone:</strong> +1 800-555-1234</li>
                <li><strong>Support Hours:</strong> Mon-Fri, 9 AM - 5 PM</li>
              </ul>
            </div>
          </section>

          <section className="relieving-section">
            <h2>some information card</h2>
            <p>
              if you need something help please follow these steps
            </p>
            <ol>
              <li>step 1 proceed with this.</li>
              <li>step 2 proceed with this</li>
              <li>step 3 proceed with this</li>
              <li>step 4 proceed with this</li>
            </ol>
            <button className="relieving-btn" onClick={() => alert('Button clicked')}>
              Button 
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;

import React, { useState } from 'react';
import './CurrentEmployees.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

const dummyEmployees = [
  {
    id: 1,
    firstName: "Likhitha",
    lastName: "A",
    email: "likhitha@example.com",
    dob: "1998-06-10",
    address1: "123 Main St",
    address2: "Apt 2B",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    citizenshipStatus: "Citizen",
    workAuthorizationStatus: "Authorized",
    workAuthorizationType: "H1B",
    eadStartDate: "2025-01-01",
    highestDegreeEarned: "Master's",
    fieldOfStudy: "Computer Science",
    universityName: "CSU Northridge",
    graduationYear: "2024",
    totalYearsExperience: "2",
    relevantSkills: "React, Node, SQL",
    previousEmployer: "ABC Corp",
    previousPosition: "Frontend Developer",
    whyJoin: "To contribute to local businesses and also to increase the team work and effort to build new applications for the organization",
    roleInterest: "Developer",
    projectName: "HCN Portal"
  },
  {
    id: 2,
    firstName: "Arjun",
    lastName: "Patel",
    email: "arjun@example.com",
    dob: "1995-03-22",
    address1: "456 Pine Ave",
    address2: "",
    city: "San Diego",
    state: "CA",
    country: "USA",
    citizenshipStatus: "Green Card",
    workAuthorizationStatus: "Authorized",
    workAuthorizationType: "GC",
    eadStartDate: "2024-11-01",
    highestDegreeEarned: "Bachelor's",
    fieldOfStudy: "Information Systems",
    universityName: "UC San Diego",
    graduationYear: "2021",
    totalYearsExperience: "3",
    relevantSkills: "Python, AWS, SQL",
    previousEmployer: "TechSoft",
    previousPosition: "Data Engineer",
    whyJoin: "I believe in your mission",
    roleInterest: "Data Analyst",
    projectName: "Analytics Portal"
  },
  {
    id: 3,
    firstName: "Meena",
    lastName: "Kumar",
    email: "meena@example.com",
    dob: "1997-08-15",
    address1: "789 Sunset Blvd",
    address2: "Suite 201",
    city: "San Jose",
    state: "CA",
    country: "USA",
    citizenshipStatus: "OPT",
    workAuthorizationStatus: "Pending",
    workAuthorizationType: "OPT",
    eadStartDate: "2025-02-15",
    highestDegreeEarned: "PhD",
    fieldOfStudy: "AI & ML",
    universityName: "Stanford",
    graduationYear: "2025",
    totalYearsExperience: "1",
    relevantSkills: "TensorFlow, PyTorch, Python",
    previousEmployer: "Stanford Lab",
    previousPosition: "Research Assistant",
    whyJoin: "To apply research in real world",
    roleInterest: "ML Engineer",
    projectName: "ML Pipeline"
  }
];

const CurrentEmployees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <div>
      <NavigationBar isLoggedIn= 'ture'/>

      <div className="admin-dashboard">
        <aside className="sidebar">
          <h2 className="sidebar-title">Heartland Community Network</h2>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="/admin/home">Home / Dashboard</a></li>
              <li><a href="/admin/pending">Pending Applications</a></li>
              <li><a href="/admin/employees" style={{ fontWeight: "900" }}>Active Employees</a></li>
              <li><a href="#projects">Projects</a></li>
            </ul>
          </nav>
        </aside>

        <main className="pending-main">
          <h2 className="pending-title">Admin Dashboard - Current Employees</h2>

          <div className="pending-header">
            <span><strong>Total Count</strong>: {dummyEmployees.length}</span>
            <span>{dummyEmployees.length} Rows</span>
          </div>

          <div className="pending-content">
            <table className="applicant-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Role</th>
                  <th>Project</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dummyEmployees.map((emp, idx) => (
                  <tr key={emp.id}>
                    <td>{idx + 1}. {emp.firstName} {emp.lastName}</td>
                    <td>{emp.roleInterest}</td>
                    <td>{emp.projectName}</td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedEmployee(emp)}>
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {selectedEmployee && (
        <div className="modal-backdrop" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Employee Profile</h3>
            <div className="profile-structured">
              {Object.entries(selectedEmployee).map(([key, value]) => (
                <div className="profile-line" key={key}>
                  <span className="profile-label">{formatLabel(key)}</span>
                  <span className="profile-value">{value}</span>
                </div>
              ))}
            </div>
            <div className="action-buttons">
              <button className="close-btn" onClick={() => setSelectedEmployee(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentEmployees;

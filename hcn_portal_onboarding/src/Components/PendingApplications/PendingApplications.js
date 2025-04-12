import React, { useState } from 'react';
import './PendingApplications.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
// import html2pdf from 'html2pdf.js';

const dummyApplicants = [
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
    roleInterest: "Developer"
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
    roleInterest: "Data Analyst"
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
    roleInterest: "ML Engineer"
  }
];

const PendingApplications = () => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

// Function Download PDF to download the applicant profile as a PDF

  // const downloadPDF = (applicant) => {
  //   const element = document.getElementById('profile-to-print');
  //   const options = {
  //     margin: 0.5,
  //     filename: `${applicant.firstName}_${applicant.lastName}_Profile.pdf`,
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  //   };
  
  //   html2pdf().set(options).from(element).save();
  // };

  return (
    <div>
      <NavigationBar />

      <div className="admin-dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Heartland Community Network</h2>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="/admin/home" >Home / Dashboard</a></li>
              <li><a href="/admin/pending" style={{ fontWeight: "900" }}>Pending Applications</a></li>
              <li><a href="#employees">Active Employees</a></li>
              <li><a href="#projects">Projects</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="pending-main">
          <h2 className="pending-title">Admin Dashboard - Pending Applications</h2>

          <div className="pending-header">
            <span><strong>Total Count</strong>: {dummyApplicants.length}</span>
            <span>{dummyApplicants.length} Rows</span>
          </div>

          <div className="pending-content">
            <table className="applicant-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Position Applied For</th>
                  <th>Date Applied</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dummyApplicants.map((app, idx) => (
                  <tr key={app.id}>
                    <td>{idx + 1}. {app.firstName} {app.lastName}</td>
                    <td>{app.roleInterest}</td>
                    <td>04/08/2025</td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedApplicant(app)}>
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

     
    {selectedApplicant && (
        <div className="modal-backdrop" onClick={() => setSelectedApplicant(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Applicant Profile</h3>

            <div id="profile-to-print" className="profile-structured">
              {Object.entries(selectedApplicant).map(([key, value]) => (
                <div className="profile-line" key={key}>
                  <span className="profile-label">{formatLabel(key)}</span>
                  <span className="profile-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="action-buttons">
                {/* <button className="approve-btn" onClick={() => downloadPDF(selectedApplicant)}>
                  Download PDF
                </button> */}
                <button className="approve-btn" onClick={async () => {
                try {
                    const res = ""

                    if (res.ok) {
                    alert('✅ Applicant is approved!');
                    setSelectedApplicant(null);
                    } else {
                    alert('❌ Something went wrong!');
                    }
                } catch (err) {
                    console.error(err);
                    alert('❌ Error approving applicant!');
                }
                }}>
                Approve
                </button>

                <button className="reject-btn" onClick={() => {
                alert('❌ Applicant has been rejected.');
                setSelectedApplicant(null);
                }}>
                Reject
                </button>

                <button className="close-btn" onClick={() => setSelectedApplicant(null)}>Close</button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default PendingApplications;

import React, { useState } from 'react';
import './EmployeeProfile.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import Employee_Icon from '../../Images/Employee_Icon.png';

const mockEmployee = {
  name: 'Likhitha A.',
  role: 'Frontend Developer',
  project: 'HCN Portal',
  email: 'likhitha@example.com',
  phone: '+1 123-456-7890',
  dob: '1998-06-10',
  address: '123 Main St, Apt 2B, Los Angeles, CA',
  skills: 'React, JavaScript, CSS',
  education: 'MS in Computer Science, CSU Northridge',
  citizenshipStatus: 'Citizen',
  workAuthType: 'H1B',
  eadStartDate: '2025-01-01',
  fieldOfStudy: 'Computer Science',
  university: 'CSU Northridge',
  gradYear: '2024',
  experience: '2 years',
  previousEmployer: 'ABC Corp',
  previousPosition: 'Frontend Developer',
  whyJoin: 'To contribute to local businesses...',
  roleInterest: 'Developer'
};

//  or

const employeeInfo = {
    "Personal Information": {
      "Phone": "+1 123-456-7890",
      "Date of Birth": "1998-06-10",
      "Address": "123 Main St, Apt 2B, Los Angeles, CA"
    },
    "Immigration / Work Authorization": {
      "Citizenship Status": "Citizen",
      "Work Auth Type": "H1B",
      "EAD Start Date": "2025-01-01"
    },
    "Education": {
      "Field of Study": "Computer Science",
      "University": "CSU Northridge",
      "Graduation Year": "2024"
    },
    "Professional Experience": {
      "Experience": "2 years",
      "Skills": "React, JavaScript, CSS",
      "Previous Employer": "ABC Corp",
      "Previous Position": "Frontend Developer"
    },
    "HR Questions": {
      "Why HCN?": "To build community-driven software.",
      "Role Interest": "Frontend Developer"
    }
  };
  
const EmployeeProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(mockEmployee);
  const [photo, setPhoto] = useState(Employee_Icon);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div>
      <NavigationBar isLoggedIn='true' />

      <div className="employee-dashboard">
        <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}></button>

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
                <li><a href="/employee/home" >Employee Home</a></li>
                <li><a href="/employee/profile" style={{ fontWeight: "900" }}>Profile</a></li>
                <li><a href="#Project">Project Details</a></li>
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
            <h1>Employee Dashboard - "{profile.name}" Profile</h1>
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>{editMode ? 'Cancel' : 'Edit'}</button>
          </div>

          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-photo-wrapper">
                <div className="profile-image" style={{ backgroundImage: `url(${photo})` }} />
                {editMode && (
                  <label htmlFor="photo-upload" className="photo-edit-icon">✎</label>
                )}
                <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
              </div>
              <h2>{profile.name}</h2>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Project:</strong> {profile.project}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>

            <div className="profile-details">
              <h3>Personal Information</h3>
              <p><strong>Phone:</strong> {editMode ? <input name="phone" value={profile.phone} onChange={handleChange} /> : profile.phone}</p>
              <p><strong>Date of Birth:</strong> {editMode ? <input name="dob" value={profile.dob} onChange={handleChange} /> : profile.dob}</p>
              <p><strong>Address:</strong> {editMode ? <input name="address" value={profile.address} onChange={handleChange} /> : profile.address}</p>

              <h3>Immigration / Work Authorization</h3>
              <p><strong>Citizenship Status:</strong> {editMode ? <input name="citizenshipStatus" value={profile.citizenshipStatus} onChange={handleChange} /> : profile.citizenshipStatus}</p>
              <p><strong>Work Auth Type:</strong> {editMode ? <input name="workAuthType" value={profile.workAuthType} onChange={handleChange} /> : profile.workAuthType}</p>
              <p><strong>EAD Start Date:</strong> {editMode ? <input name="eadStartDate" value={profile.eadStartDate} onChange={handleChange} /> : profile.eadStartDate}</p>

              <h3>Education</h3>
              <p><strong>Field of Study:</strong> {editMode ? <input name="fieldOfStudy" value={profile.fieldOfStudy} onChange={handleChange} /> : profile.fieldOfStudy}</p>
              <p><strong>University:</strong> {editMode ? <input name="university" value={profile.university} onChange={handleChange} /> : profile.university}</p>
              <p><strong>Graduation Year:</strong> {editMode ? <input name="gradYear" value={profile.gradYear} onChange={handleChange} /> : profile.gradYear}</p>

              <h3>Professional Experience</h3>
              <p><strong>Experience:</strong> {editMode ? <input name="experience" value={profile.experience} onChange={handleChange} /> : profile.experience}</p>
              <p><strong>Skills:</strong> {editMode ? <textarea name="skills" value={profile.skills} onChange={handleChange} /> : profile.skills}</p>
              <p><strong>Previous Employer:</strong> {editMode ? <input name="previousEmployer" value={profile.previousEmployer} onChange={handleChange} /> : profile.previousEmployer}</p>
              <p><strong>Previous Position:</strong> {editMode ? <input name="previousPosition" value={profile.previousPosition} onChange={handleChange} /> : profile.previousPosition}</p>

              <h3>HR Questions</h3>
              <p><strong>Why Join:</strong> {editMode ? <textarea name="whyJoin" value={profile.whyJoin} onChange={handleChange} /> : profile.whyJoin}</p>
              <p><strong>Role Interest:</strong> {editMode ? <input name="roleInterest" value={profile.roleInterest} onChange={handleChange} /> : profile.roleInterest}</p>

              {editMode && <button className="save-btn" onClick={() => setEditMode(false)}>Save</button>}
            </div>

            {/* Or */}
            
            {/* <div className="profile-details">
                {Object.entries(employeeInfo).map(([section, fields]) => (
                <div key={section}>
                <h3>{section}</h3>
                {Object.entries(fields).map(([label, value]) => (
                <p key={label}>
                <strong>{label}:</strong> {value}
                </p>
                ))}
                </div>
             ))}
            </div> */}

          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;

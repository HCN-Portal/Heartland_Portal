import React, { useState } from 'react';
import './EmployeeProfile.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import Sidebar from '../Sidebar/Sidebar';
import Employee_Icon from '../../Images/Employee_Icon.png';

const initialProfile = {
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

const EmployeeProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [photo, setPhoto] = useState(Employee_Icon);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    alert('Profile saved successfully!');
    setEditMode(false);
  };

  const renderField = (label, name, multiline = false) => (
    <p>
      <strong>{label}:</strong>{' '}
      {editMode ? (
        multiline ? (
          <textarea name={name} value={profile[name]} onChange={handleChange} />
        ) : (
          <input name={name} value={profile[name]} onChange={handleChange} />
        )
      ) : (
        profile[name]
      )}
    </p>
  );

  return (
    <div>
      <NavigationBar isLoggedIn={true} />
      <div className="employee-dashboard">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-main">
          <div className="employee-header">
            <h1>Employee Dashboard - "{profile.name}" Profile</h1>
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-photo-wrapper">
                <div className="profile-image" style={{ backgroundImage: `url(${photo})` }} />
                {editMode && (
                  <label htmlFor="photo-upload" className="photo-edit-icon">✎</label>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </div>
              <h2>{profile.name}</h2>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Project:</strong> {profile.project}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>

            <div className="profile-details">
              <h3>Personal Information</h3>
              {renderField("Phone", "phone")}
              {renderField("Date of Birth", "dob")}
              {renderField("Address", "address")}

              <h3>Immigration / Work Authorization</h3>
              {renderField("Citizenship Status", "citizenshipStatus")}
              {renderField("Work Auth Type", "workAuthType")}
              {renderField("EAD Start Date", "eadStartDate")}

              <h3>Education</h3>
              {renderField("Field of Study", "fieldOfStudy")}
              {renderField("University", "university")}
              {renderField("Graduation Year", "gradYear")}

              <h3>Professional Experience</h3>
              {renderField("Experience", "experience")}
              {renderField("Skills", "skills", true)}
              {renderField("Previous Employer", "previousEmployer")}
              {renderField("Previous Position", "previousPosition")}

              <h3>HR Questions</h3>
              {renderField("Why Join", "whyJoin", true)}
              {renderField("Role Interest", "roleInterest")}

              {editMode && (
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;

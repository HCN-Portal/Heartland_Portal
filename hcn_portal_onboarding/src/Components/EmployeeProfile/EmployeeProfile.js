import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './EmployeeProfile.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import Sidebar from '../Sidebar/Sidebar';
import Employee_Icon from '../../Images/Employee_Icon.png';
import { get_user_by_id, update_profile } from '../../store/reducers/userReducer';

const EmployeeProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [photo, setPhoto] = useState(Employee_Icon);
  const dispatch = useDispatch();

  // Get user data from Redux store
  const authState = useSelector(state => state.auth);
  const { selectedUser, loading, error } = useSelector(state => state.user);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Get user info from Redux or localStorage
    const userInfo = authState.userInfo || JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo?.userId) {
      dispatch(get_user_by_id(userInfo.userId));
    }
  }, [dispatch, authState.userInfo]);

  useEffect(() => {
    if (selectedUser) {
      setProfile({
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        preferredName: selectedUser.preferredName || '',
        email: selectedUser.email || '',
        phoneNumber: selectedUser.phoneNumber || '',
        address1: selectedUser.address1 || '',
        address2: selectedUser.address2 || '',
        citizenshipStatus: selectedUser.citizenshipStatus || '',
        workAuthorizationType: selectedUser.workAuthorizationType || '',
        eadStartDate: selectedUser.eadStartDate ? new Date(selectedUser.eadStartDate).toISOString().split('T')[0] : '',
        highestDegreeEarned: selectedUser.highestDegreeEarned || '',
        fieldOfStudy: selectedUser.fieldOfStudy || '',
        universityName: selectedUser.universityName || '',
        graduationYear: selectedUser.graduationYear || '',
        totalYearsExperience: selectedUser.totalYearsExperience || '',
        relevantSkills: selectedUser.relevantSkills || [],
        previousEmployer: selectedUser.previousEmployer || '',
        previousPosition: selectedUser.previousPosition || '',
        projectsAssigned: selectedUser.projectsAssigned || []
      });
    }
  }, [selectedUser]);

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

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateProfile = (data) => {
    const errors = [];

    // Required field validation
    const requiredFields = {
      'Phone Number': data.phoneNumber,
      'Address': data.address1,
      'Citizenship Status': data.citizenshipStatus,
      'Work Authorization Type': data.workAuthorizationType,
      'Highest Degree': data.highestDegreeEarned,
      'Field of Study': data.fieldOfStudy,
      'University': data.universityName,
      'Graduation Year': data.graduationYear,
      'Total Years of Experience': data.totalYearsExperience,
      'Previous Employer': data.previousEmployer,
      'Previous Position': data.previousPosition
    };

    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value || value.trim() === '') {
        errors.push(`${field} is required`);
      }
    });

    // Phone number format validation
    if (data.phoneNumber && !validatePhoneNumber(data.phoneNumber)) {
      errors.push('Invalid phone number format. Please use format: +1 (123) 456-7890');
    }

    // Email format validation
    if (data.email && !validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    // Graduation year validation
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(data.graduationYear);
    if (isNaN(gradYear) || gradYear < 1950 || gradYear > currentYear + 10) {
      errors.push('Invalid graduation year');
    }

    // Skills validation
    if (!data.relevantSkills || (Array.isArray(data.relevantSkills) && data.relevantSkills.length === 0)) {
      errors.push('At least one skill is required');
    }

    // Experience validation
    if (data.totalYearsExperience) {
      const years = parseFloat(data.totalYearsExperience);
      if (isNaN(years) || years < 0) {
        errors.push('Experience years must be a positive number');
      }
    }

    // EAD date validation if provided
    if (data.eadStartDate) {
      const eadDate = new Date(data.eadStartDate);
      if (isNaN(eadDate.getTime())) {
        errors.push('Invalid EAD start date');
      }
    }

    return errors;
  };

  const handleSave = async () => {
    try {
      const userInfo = authState.userInfo || JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo?.userId) {
        throw new Error('User ID not found');
      }

      // Prepare the update data
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        preferredName: profile.preferredName,
        phoneNumber: profile.phoneNumber,
        address1: profile.address1,
        address2: profile.address2,
        citizenshipStatus: profile.citizenshipStatus,
        workAuthorizationType: profile.workAuthorizationType,
        eadStartDate: profile.eadStartDate,
        highestDegreeEarned: profile.highestDegreeEarned,
        fieldOfStudy: profile.fieldOfStudy,
        universityName: profile.universityName,
        graduationYear: profile.graduationYear,
        totalYearsExperience: profile.totalYearsExperience,
        relevantSkills: Array.isArray(profile.relevantSkills) ? profile.relevantSkills : profile.relevantSkills.split(',').map(skill => skill.trim()),
        previousEmployer: profile.previousEmployer,
        previousPosition: profile.previousPosition
      };

      // Validate the data
      const validationErrors = validateProfile(updateData);
      if (validationErrors.length > 0) {
        throw new Error('Validation errors:\n' + validationErrors.join('\n'));
      }

      await dispatch(update_profile({ userId: userInfo.userId, profileData: updateData })).unwrap();
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const renderField = (label, name, multiline = false, type = 'text') => (
    <p>
      <strong>{label}:</strong>{' '}
      {editMode ? (
        multiline ? (
          <textarea
            name={name}
            value={name === 'relevantSkills' ? (Array.isArray(profile[name]) ? profile[name].join(', ') : profile[name]) : profile[name]}
            onChange={handleChange}
          />
        ) : (
          <input name={name} value={profile[name]} onChange={handleChange} type={type} />
        )
      ) : (
        name === 'relevantSkills' ?
          (Array.isArray(profile[name]) ? profile[name].join(', ') : profile[name]) :
          profile[name]
      )}
    </p>
  );

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  return (
    <div>
      <NavigationBar isLoggedIn={true} />
      <div className="employee-dashboard">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-main">
          <div className="employee-header">
            <h1>Employee Profile</h1>
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
              <h2>{`${profile.firstName} ${profile.lastName}`}</h2>
              {profile.preferredName && <p><em>Preferred Name: {profile.preferredName}</em></p>}
              <p><strong>Employee ID:</strong> {selectedUser?.employeeId}</p>
              {/*<p><strong>Role:</strong> {selectedUser?.role}</p>*/}
              <p><strong>Email:</strong> {profile.email}</p>
            </div>

            <div className="profile-details">
              <h3>Personal Information</h3>
              {renderField("Phone Number", "phoneNumber")}
              {renderField("Address Line 1", "address1")}
              {renderField("Address Line 2", "address2")}

              <h3>Immigration / Work Authorization</h3>
              {renderField("Citizenship Status", "citizenshipStatus")}
              {renderField("Work Authorization Type", "workAuthorizationType")}
              {renderField("EAD Start Date", "eadStartDate", false, "date")}

              <h3>Education</h3>
              {renderField("Highest Degree Earned", "highestDegreeEarned")}
              {renderField("Field of Study", "fieldOfStudy")}
              {renderField("University", "universityName")}
              {renderField("Graduation Year", "graduationYear")}

              <h3>Professional Experience</h3>
              {renderField("Total Years of Experience", "totalYearsExperience")}
              {renderField("Relevant Skills", "relevantSkills", true)}
              {renderField("Previous Employer", "previousEmployer")}
              {renderField("Previous Position", "previousPosition")}

              <h3>Assigned Projects</h3>
              <div className="projects-list">
                {profile.projectsAssigned && profile.projectsAssigned.length > 0 ? (
                  profile.projectsAssigned.map(project => (
                    <div key={project.projectId} className="project-item">
                      {project.title}
                    </div>
                  ))
                ) : (
                  <p>No projects currently assigned</p>
                )}
              </div>

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

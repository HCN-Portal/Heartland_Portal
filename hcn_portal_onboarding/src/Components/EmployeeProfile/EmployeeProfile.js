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
  const [validationErrors, setValidationErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const handleSkillInputChange = (e) => setSkillInput(e.target.value);
  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(skillInput.trim())) {
        setProfile({
          ...profile,
          skills: [...profile.skills, skillInput.trim()],
        });
        setSkillInput("");
      }
    }
  };
  const handleRemoveSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  };
  const validateProfile = () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = "Name is required.";
    if (!profile.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      errors.email = "Invalid email.";
    if (!profile.phone.match(/^\d{10}$/))
      errors.phone = "Phone number must be exactly 10 digits.";
    if (!profile.dob.match(/^\d{4}-\d{2}-\d{2}$/))
      errors.dob = "Date format: YYYY-MM-DD";
    if (!profile.address.trim()) errors.address = "Address is required.";
    if (!profile.citizenshipStatus.trim())
      errors.citizenshipStatus = "Required.";
    if (!profile.workAuthType.trim()) errors.workAuthType = "Required.";
    if (!profile.eadStartDate.match(/^\d{4}-\d{2}-\d{2}$/))
      errors.eadStartDate = "Date format: YYYY-MM-DD";
    if (!profile.fieldOfStudy.trim()) errors.fieldOfStudy = "Required.";
    if (!profile.university.trim()) errors.university = "Required.";
    if (!profile.gradYear.match(/^\d{4}$/))
      errors.gradYear = "Year format: YYYY";
    if (!profile.experience.trim()) errors.experience = "Required.";
    if (!profile.skills.length)
      errors.skills = "At least one skill is required.";
    if (!profile.previousEmployer.trim()) errors.previousEmployer = "Required.";
    if (!profile.previousPosition.trim()) errors.previousPosition = "Required.";
    if (!profile.whyJoin.trim()) errors.whyJoin = "Required.";
    if (!profile.roleInterest.trim()) errors.roleInterest = "Required.";
    return errors;
  };
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
    if (editMode) {
      setValidationErrors({ ...validationErrors, [name]: undefined }); // Clear error on change
    }
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

  const renderField = (label, name, multiline = false) => {
    // Special handling for Citizenship Status field
    if (editMode && name === "citizenshipStatus") {
      return (
        <p>
          <strong>{label}:</strong>{" "}
          <select name={name} value={profile[name]} onChange={handleChange}>
            <option value="">Select Citizenship Status</option>
            <option value="Immigrant">Immigrant</option>
            <option value="Non Immigrant">Non Immigrant</option>
            <option value="Citizen">Non Immigrant</option>
          </select>
          {editMode && validationErrors[name] && (
            <span
              className="error-msg"
              style={{ color: "red", fontSize: "0.9em" }}
            >
              {validationErrors[name]}
            </span>
          )}
        </p>
      );
    }
    if (name === "skills") {
      if (editMode) {
        return (
          <p>
            <strong>{label}:</strong>{' '}
            <div className="skills-tag-input">
              {profile.skills.map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button type="button" className="remove-skill-btn" onClick={() => handleRemoveSkill(skill)}>
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={handleSkillInputChange}
                onKeyDown={handleSkillInputKeyDown}
                placeholder="Add skill and press Enter"
                className="skill-input"
              />
            </div>
            {editMode && validationErrors[name] && (
              <span className="error-msg" style={{ color: 'red', fontSize: '0.9em' }}>
                {validationErrors[name]}
              </span>
            )}
          </p>
        );
      } else {
        return (
          <p>
            <strong>{label}:</strong>{' '}
            {profile.skills.join(', ')}
          </p>
        );
      }
    }
    // Special handling for Address field with browser autofill
    if (editMode && name === "address") {
      return (
        <p>
          <strong>{label}:</strong>{" "}
          <input
            name={name}
            value={profile[name]}
            onChange={handleChange}
            autoComplete="street-address"
          />
          {editMode && validationErrors[name] && (
            <span
              className="error-msg"
              style={{ color: "red", fontSize: "0.9em" }}
            >
              {validationErrors[name]}
            </span>
          )}
        </p>
      );
    }
    // Special handling for EAD Start Date field
    if (editMode && name === "eadStartDate") {
      return (
        <p>
          <strong>{label}:</strong>{" "}
          <input
            type="date"
            name={name}
            value={profile[name]}
            onChange={handleChange}
          />
          {editMode && validationErrors[name] && (
            <span
              className="error-msg"
              style={{ color: "red", fontSize: "0.9em" }}
            >
              {validationErrors[name]}
            </span>
          )}
        </p>
      );
    }
    // Special handling for Date of Birth field
    if (editMode && name === "dob") {
      return (
        <p>
          <strong>{label}:</strong>{" "}
          <input
            type="date"
            name={name}
            value={profile[name]}
            onChange={handleChange}
          />
          {editMode && validationErrors[name] && (
            <span
              className="error-msg"
              style={{ color: "red", fontSize: "0.9em" }}
            >
              {validationErrors[name]}
            </span>
          )}
        </p>
      );
    }
    // Special handling for Work Auth Type field
    if (editMode && name === "workAuthType") {
      return (
        <p>
          <strong>{label}:</strong>{" "}
          <select name={name} value={profile[name]} onChange={handleChange}>
            <option value="">Select Work Auth Type</option>
            <option value="H1B">H1B</option>
            <option value="L1">L1</option>
            <option value="F1">F1</option>
            <option value="OPT">OPT</option>
            <option value="CPT">CPT</option>
            <option value="EAD">EAD</option>
            <option value="Citizen">Citizen</option>
            <option value="Green Card">Green Card</option>
          </select>
          {editMode && validationErrors[name] && (
            <span
              className="error-msg"
              style={{ color: "red", fontSize: "0.9em" }}
            >
              {validationErrors[name]}
            </span>
          )}
        </p>
      );
    }
    return (
      <p>
        <strong>{label}:</strong>{" "}
        {editMode ? (
          multiline ? (
            <textarea
              name={name}
              value={profile[name]}
              onChange={handleChange}
            />
          ) : (
            <input name={name} value={profile[name]} onChange={handleChange} />
          )
        ) : (
          profile[name]
        )}
        {editMode && validationErrors[name] && (
          <span
            className="error-msg"
            style={{ color: "red", fontSize: "0.9em" }}
          >
            {validationErrors[name]}
          </span>
        )}
      </p>
    );
  };

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
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="dashboard-main">
          <div className="employee-header">
            <h1>Employee Profile</h1>
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-photo-wrapper">
                <div
                  className="profile-image"
                  style={{ backgroundImage: `url(${photo})` }}
                />
                {editMode && (
                  <label htmlFor="photo-upload" className="photo-edit-icon">
                    ✎
                  </label>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
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
              {renderField("Skills", "relevantSkills", true)}
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

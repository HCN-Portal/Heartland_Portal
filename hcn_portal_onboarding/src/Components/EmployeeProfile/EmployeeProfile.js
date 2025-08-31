import React, { useState } from "react";
import "./EmployeeProfile.css";
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import Sidebar from "../Sidebar/Sidebar";
import Employee_Icon from "../../Images/Employee_Icon.png";

const initialProfile = {
  name: "Likhitha A.",
  role: "Frontend Developer",
  project: "HCN Portal",
  email: "likhitha@example.com",
  phone: "+1 123-456-7890",
  dob: "1998-06-10",
  address: "123 Main St, Apt 2B, Los Angeles, CA",
  skills: ["React", "JavaScript", "CSS"],
  education: "MS in Computer Science, CSU Northridge",
  citizenshipStatus: "Citizen",
  workAuthType: "H1B",
  eadStartDate: "2025-01-01",
  fieldOfStudy: "Computer Science",
  university: "CSU Northridge",
  gradYear: "2024",
  experience: "2 years",
  previousEmployer: "ABC Corp",
  previousPosition: "Frontend Developer",
  whyJoin: "To contribute to local businesses...",
  roleInterest: "Developer",
};

const EmployeeProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
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

  const handleSave = () => {
    if (editMode) {
      const errors = validateProfile();
      setValidationErrors(errors);
      if (Object.keys(errors).length === 0) {
        alert("Profile saved successfully!");
        setEditMode(false);
      }
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
            <h1>Employee Dashboard - "{profile.name}" Profile</h1>
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
              <h2>{profile.name}</h2>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
              <p>
                <strong>Project:</strong> {profile.project}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
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

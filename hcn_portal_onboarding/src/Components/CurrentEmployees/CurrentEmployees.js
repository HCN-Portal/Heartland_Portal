import React, { useState, useEffect } from 'react';
import './CurrentEmployees.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import { useDispatch, useSelector } from 'react-redux';
import { get_all_users,get_user_by_id,clearSelectedUser } from '../../store/reducers/userReducer';
import Sidebar from '../Sidebar/Sidebar';

const CurrentEmployees = () => {
  const dispatch = useDispatch();
  const { users, loading,selectedUser  } = useSelector((state) => state.users);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);



  useEffect(() => {
    console.log("fdjbhm")
    dispatch(get_all_users());
    console.log(users,"yushd");
  }, [dispatch]);



  // const approvedEmployees = users
console.log(users.users)
console.log(Array.isArray(users)); // should be true
console.log(typeof users.users); 
const approvedEmployees = users.filter(user =>
  ['manager', 'employee'].includes(user.role?.toLowerCase())
);
const [currentPage, setCurrentPage] = useState(1);
const employeesPerPage = 2;
const indexOfLastEmployee = currentPage * employeesPerPage;
const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
// const currentEmployees = approvedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
// const totalPages = Math.ceil(approvedEmployees.length / employeesPerPage);
const [filterStatus, setFilterStatus] = useState('all');

const filteredEmployees = approvedEmployees.filter(emp => {
  if (filterStatus === 'assigned') {
    return Array.isArray(emp.projectsAssigned) && emp.projectsAssigned.length > 0;
  }
  if (filterStatus === 'unassigned') {
    return !Array.isArray(emp.projectsAssigned) || emp.projectsAssigned.length === 0;
  }
  return true; // 'all'
});
const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

const handleFilterChange = (e) => {
  setFilterStatus(e.target.value);
  setCurrentPage(1); // reset pagination
};

const handleResetFilter = () => {
  setFilterStatus('all');
  setCurrentPage(1);
};


  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/Id$/, 'ID')
      .replace(/Ead/g, 'EAD')
      .replace(/Dob/g, 'DOB');
  };

  const formatValue = (key, value) => {
    const dateFields = ['dob', 'eadStartDate', 'visaEADExpiryDate', 'dateOfSubmission'];
    if (key === 'projectsAssigned' && Array.isArray(value)) {
    return value.map(p => p.title).join(', ') || 'Unassigned';
  }
    if (dateFields.includes(key) && value) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US');
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return  JSON.stringify(value);
    }
   
    return value || 'N/A';
  };


const handleViewProfile=(userId) =>{
    dispatch(get_user_by_id(userId));
}

  return (
    <div>
      <NavigationBar isLoggedIn='true' />

      <div className="admin-dashboard">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="pending-main">
          <h2 className="pending-title">Admin Dashboard - Employees</h2>

          {/* <div className="pending-header">
            <span><strong>Total Count</strong>: {approvedEmployees.length}</span>
            <span>{approvedEmployees.length} Rows</span>
          </div> */}

          <div className="pending-content">


<div className="filter-controls">
  <label htmlFor="statusFilter">Filter by Project Status:</label>
  <select
    id="statusFilter"
    value={filterStatus}
    onChange={handleFilterChange}
    className={filterStatus !== 'all' ? 'selected' : ''}
  >
    <option value="all">All</option>
    <option value="assigned">Assigned</option>
    <option value="unassigned">Unassigned</option>
  </select>
  <button className="reset-btn" onClick={handleResetFilter}>
    Reset
  </button>
</div>


            <div className="table-wrapper">
            <table className="applicant-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Role</th>
                  <th>Project Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              {/* <tbody>
                {approvedEmployees.map((emp, idx) => (
                  <tr key={emp._id}>
                    <td data-label = "Employee Name">{idx + 1}. {emp.firstName} {emp.lastName}</td>
                    <td data-label = "Role">{emp.role || 'N/A'}</td>
                    <td data-label = "Project Status">{Array.isArray(emp.projectsAssigned) && emp.projectsAssigned.length > 0 ? 'Assigned' : 'Unassigned'}</td>

                    <td data-label = "Action">
                            <button className="view-btn" onClick={() => handleViewProfile(emp._id)}>
                                View Profile
                            </button>
                    </td>
                  </tr>
                ))}
              </tbody> */}


<tbody>
  {currentEmployees.map((emp, idx) => (
    <tr key={emp._id}>
      <td data-label="Employee Name">
        {(indexOfFirstEmployee + idx + 1)}. {emp.firstName} {emp.lastName}
      </td>
      <td data-label="Role">{emp.role || 'N/A'}</td>
      <td data-label="Project Status">
        {Array.isArray(emp.projectsAssigned) && emp.projectsAssigned.length > 0 ? 'Assigned' : 'Unassigned'}
      </td>
      <td data-label="Action">
        <button className="view-btn" onClick={() => handleViewProfile(emp._id)}>
          View Profile
        </button>
      </td>
    </tr>
  ))}
</tbody>


            </table>

              <div className="pagination-controls">
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="page-btn"
  >
    Prev
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="page-btn"
  >
    Next
  </button>
</div>



            </div>
          </div>
        </main>
      </div>

      {/* {selectedEmployee && (
        <div className="modal-backdrop" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Employee Profile</h3>
            <table className="profile-table">
              <tbody>
                {Object.entries(selectedEmployee)
                  .filter(([key]) => !['_id', '__v', 'acknowledgments'].includes(key))
                  .map(([key, value]) => (
                    <tr key={key}>
                      <td className="profile-label">{formatLabel(key)}</td>
                      <td className="profile-value">{formatValue(key, value)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="action-buttons">
              <button className="close-btn" onClick={() => setSelectedEmployee(null)}>Close</button>
            </div>
          </div>
        </div>
      )} */}
{selectedUser && (
  <div className="modal-backdrop" onClick={() => dispatch(clearSelectedUser())}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Employee Profile</h3>
      <table className="profile-table">
        <tbody>
          {Object.entries(selectedUser)
            .filter(([key]) => !['_id', '__v', 'acknowledgments'].includes(key))
            .map(([key, value]) => (
              <tr key={key}>
                <td className="profile-label">{formatLabel(key)}</td>
                <td className="profile-value">{formatValue(key, value)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="action-buttons">
        <button className="close-btn" onClick={() => dispatch(clearSelectedUser())}>
          Close
        </button>
      </div>
    </div>
  </div>
)}





    </div>
  );
};

export default CurrentEmployees;
// import React, { useState, useEffect } from 'react';
// import './CurrentEmployees.css';
// import NavigationBar from '../UI/NavigationBar/NavigationBar';
// import { useDispatch, useSelector } from 'react-redux';
// import { get_all_applications } from '../../store/reducers/appReducer';

// const CurrentEmployees = () => {
//   const dispatch = useDispatch();
//   const { applications, loading } = useSelector((state) => state.application);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   useEffect(() => {
//     dispatch(get_all_applications());
//   }, [dispatch]);

//   const formatLabel = (label) => {
//     return label
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, str => str.toUpperCase());
//   };

//   const approvedEmployees = applications.filter(app => app.status === 'Approved');
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div>
//       <NavigationBar isLoggedIn='true' />

//       <div className="admin-dashboard">

//       <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
//       </button>

//       {sidebarOpen ? (
//         <aside className="sidebar">
//           <div className="sidebar-header">
//             <button className="toggle-sidebar-btn-inside" onClick={() => setSidebarOpen(false)}>
//               &#9776;
//             </button>
//             <h2 className="sidebar-title">Heartland Community Network</h2>
//           </div>

//           <nav className="sidebar-nav">
//             <ul>
//               <li><a href="/admin/home">Home / Dashboard</a></li>
//               <li><a href="/admin/pending">Pending Applications</a></li>
//               <li><a href="/admin/employees" style={{ fontWeight: "900" }}>Active Employees</a></li>
//               <li><a href="#projects">Projects</a></li>
//             </ul>
//           </nav>
//         </aside>
//       ) : (
//         <div className="collapsed-sidebar">
//           <div className="collapsed-top">
//             <button className="toggle-sidebar-btn-collapsed" onClick={() => setSidebarOpen(true)}>
//               &#9776;
//             </button>
//           </div>
//         </div>
//       )}

//         <main className="pending-main">
//           <h2 className="pending-title">Admin Dashboard - Current Employees</h2>

//           <div className="pending-header">
//             <span><strong>Total Count</strong>: {approvedEmployees.length}</span>
//             <span>{approvedEmployees.length} Rows</span>
//           </div>

//           <div className="pending-content">
//             <table className="applicant-table">
//               <thead>
//                 <tr>
//                   <th>Employee Name</th>
//                   <th>Role</th>
//                   <th>Project</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {approvedEmployees.map((emp, idx) => (
//                   <tr key={emp._id}>
//                     <td>{idx + 1}. {emp.firstName} {emp.lastName}</td>
//                     <td>{emp.roleInterest}</td>
//                     <td>{emp.projectName || 'N/A'}</td>
//                     <td>
//                       <button className="view-btn" onClick={() => setSelectedEmployee(emp)}>
//                         View Profile
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>

//       {selectedEmployee && (
//         <div className="modal-backdrop" onClick={() => setSelectedEmployee(null)}>
//         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//           <h3>Employee Profile</h3>
//             <table className="profile-table">
//               <tbody>
//                 {Object.entries(selectedEmployee).map(([key, value]) => (
//                   <tr key={key}>
//                     <td className="profile-label">{formatLabel(key)}</td>
//                     <td className="profile-value">{Array.isArray(value) ? value.join(', ') : value?.toString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>  
          
//           <div className="action-buttons">
//             <button className="close-btn" onClick={() => setSelectedEmployee(null)}>Close</button>
//           </div>
//         </div>
//       </div>
        
//       )}
//     </div>
//   );
// };

// export default CurrentEmployees;


import React, { useState, useEffect } from 'react';
import './CurrentEmployees.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import { useDispatch, useSelector } from 'react-redux';
import { get_all_applications } from '../../store/reducers/appReducer';

const CurrentEmployees = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.application);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(get_all_applications());
  }, [dispatch]);

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/Id$/, 'ID')
      .replace(/Ead/g, 'EAD')
      .replace(/Dob/g, 'DOB');
  };

  const approvedEmployees = applications.filter(app => app.status === 'Approved');

  const formatValue = (key, value) => {
    const dateFields = ['dob', 'eadStartDate', 'visaEADExpiryDate', 'dateOfSubmission'];
    if (dateFields.includes(key) && value) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US');
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value || 'N/A';
  };

  return (
    <div>
      <NavigationBar isLoggedIn='true' />

      <div className="admin-dashboard">

        <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)} />

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
                <li><a href="/admin/home">Home / Dashboard</a></li>
                <li><a href="/admin/pending">Pending Applications</a></li>
                <li><a href="/admin/employees" style={{ fontWeight: "900" }}>Active Employees</a></li>
                <li><a href="#projects">Projects</a></li>
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

        <main className="pending-main">
          <h2 className="pending-title">Admin Dashboard - Current Employees</h2>

          <div className="pending-header">
            <span><strong>Total Count</strong>: {approvedEmployees.length}</span>
            <span>{approvedEmployees.length} Rows</span>
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
                {approvedEmployees.map((emp, idx) => (
                  <tr key={emp._id}>
                    <td>{idx + 1}. {emp.firstName} {emp.lastName}</td>
                    <td>{emp.roleInterest || 'N/A'}</td>
                    <td>{emp.projectName || 'N/A'}</td>
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
      )}
    </div>
  );
};

export default CurrentEmployees;

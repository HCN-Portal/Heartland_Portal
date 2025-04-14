import React, { useState, useEffect } from 'react';
import './PendingApplications.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import { useDispatch, useSelector } from 'react-redux';
import { get_all_applications, update_application_status } from '../../store/reducers/appReducer';

const PendingApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.application);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const capitalize = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const hiddenFields = ['_id', '__v', 'acknowledgments', 'createdAt', 'updatedAt'];

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  useEffect(() => {
    dispatch(get_all_applications());
  }, [dispatch]);

  const handleStatusUpdate = (status) => {
    dispatch(update_application_status({ id: selectedApplicant._id, status }))
      .unwrap()
      .then(() => {
        alert(`Applicant ${status.toLowerCase()} and emailed.`);
        setSelectedApplicant(null);
        dispatch(get_all_applications());
      })
      .catch((err) => {
        alert((err?.error || `Failed to ${status.toLowerCase()}`));
      });
  };

  return (
    <div>
      <NavigationBar />
      <div className="admin-dashboard">
        <aside className="sidebar">
          <h2 className="sidebar-title">Heartland Community Network</h2>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="/admin/home">Home / Dashboard</a></li>
              <li><a href="/admin/pending" style={{ fontWeight: '900' }}>Pending Applications</a></li>
              <li><a href="#employees">Active Employees</a></li>
              <li><a href="#projects">Projects</a></li>
            </ul>
          </nav>
        </aside>

        <main className="pending-main">
          <h2 className="pending-title">Admin Dashboard - Pending Applications</h2>

          <div className="pending-header">
            <span><strong>Total Count</strong>: {applications.filter(app => app.status === 'pending').length}</span>
            <span>{applications.filter(app => app.status === 'pending').length} Rows</span>
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
                {applications
                  .filter(app => app.status === 'pending')
                  .map((app, idx) => (
                    <tr key={app._id}>
                      <td>{idx + 1}. {capitalize(app.firstName)} {capitalize(app.lastName)}</td>
                      <td>{app.roleInterest}</td>
                      <td>{new Date(app.dateOfSubmission).toLocaleDateString()}</td>
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
              {Object.entries(selectedApplicant).map(([key, value]) => {
                if (hiddenFields.includes(key)) return null;

                return (
                  <div className="profile-line" key={key}>
                    <span className="profile-label">{formatLabel(key)}</span>
                    <span className="profile-value">
                      {Array.isArray(value)
                        ? value.join(', ')
                        : value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))
                        ? new Date(value).toLocaleDateString()
                        : value?.toString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="action-buttons">
              <button className="approve-btn" onClick={() => handleStatusUpdate('Approved')}>
                Approve
              </button>
              <button className="reject-btn" onClick={() => handleStatusUpdate('Rejected')}>
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

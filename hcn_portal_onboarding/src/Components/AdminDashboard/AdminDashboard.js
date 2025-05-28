import React, { useEffect } from 'react';
import './AdminDashboard.css';
import { get_dashboard_stats } from '../../store/reducers/appReducer';
import { useDispatch, useSelector } from 'react-redux';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingApplications, activeEmployees, ongoingProjects } = useSelector((state) => state.application);

  useEffect(() => {
    dispatch(get_dashboard_stats());
  }, [dispatch]);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="summary-cards">
        <div className="card">
          <h3>Pending Applications</h3>
          <p className="card-number">{pendingApplications}</p>
        </div>
        <div className="card">
          <h3>Active Employees</h3>
          <p className="card-number">{activeEmployees}</p>
        </div>
        <div className="card">
          <h3>Ongoing Projects</h3>
          <p className="card-number">{ongoingProjects}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

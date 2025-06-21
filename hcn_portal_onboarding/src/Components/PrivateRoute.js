import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); // You should save this on login

  if (!token || !userInfo) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/login" />; 
  }

  return <Outlet />;
};

export default PrivateRoute;

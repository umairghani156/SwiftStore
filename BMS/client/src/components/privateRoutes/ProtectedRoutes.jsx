import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user');
  if(!token || !userRole) return <Navigate to="/login" />

  const isAuthenticated = token && allowedRoles.includes(userRole);

 return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

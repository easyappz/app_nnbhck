import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { accessToken, user, loading } = useAuth();
  const location = useLocation();
  const isAuthenticated = Boolean(accessToken || user);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }} data-easytag="id1-src/components/ProtectedRoute.jsx">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;

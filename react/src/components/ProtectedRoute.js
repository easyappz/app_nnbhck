import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { accessToken, user, initTried } = useAuth();
  const location = useLocation();

  if (!initTried) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }} data-easytag="id1-src/components/ProtectedRoute.js">
        <Spin size="large" />
      </div>
    );
  }

  if (!accessToken && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

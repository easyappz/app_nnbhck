import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
  const { user, accessToken, initTried } = useAuth();
  const location = useLocation();

  const isAuth = Boolean(user || accessToken);

  if (!initTried) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }} data-easytag="id1-src/components/ProtectedRoute.jsx">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

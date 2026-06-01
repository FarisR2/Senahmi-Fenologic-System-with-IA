import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../interfaces';

const AdminRoute: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || user?.role !== Role.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

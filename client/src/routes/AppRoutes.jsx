import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';
import ForgotPassword from '../pages/Auth/ForgotPassword.jsx';
import UserProfile from '../pages/Profile/UserProfile.jsx';

import EmployeeDashboard from '../pages/Employee/Dashboard.jsx';
import MyVouchers from '../pages/Employee/MyVouchers.jsx';
import CreateVoucher from '../pages/Employee/CreateVoucher.jsx';
import EditVoucher from '../pages/Employee/EditVoucher.jsx';

import DirectorDashboard from '../pages/Director/Dashboard.jsx';
import PendingApprovals from '../pages/Director/PendingApprovals.jsx';
import AllVouchersDirector from '../pages/Director/AllVouchers.jsx';

import AccountsDashboard from '../pages/Accounts/Dashboard.jsx';
import AllVouchersAccounts from '../pages/Accounts/AllVouchers.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullPage text="Verifying authentication session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullPage text="Loading portal session..." />;
  }

  const userRole = user?.role?.toLowerCase();
  const isAllowed = allowedRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  if (!isAllowed) {
    if (userRole === 'director' || userRole === 'admin') {
      return <Navigate to="/director/dashboard" replace />;
    } else if (userRole === 'accounts') {
      return <Navigate to="/accounts/dashboard" replace />;
    } else if (userRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const getDefaultDashboard = () => {
    if (!isAuthenticated) return '/login';
    const role = user?.role?.toLowerCase();
    if (role === 'director' || role === 'admin') return '/director/dashboard';
    if (role === 'accounts') return '/accounts/dashboard';
    return '/employee/dashboard';
  };

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Authenticated Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to={getDefaultDashboard()} replace />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <RoleRoute allowedRoles={['Employee']}>
              <EmployeeDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/employee/vouchers"
          element={
            <RoleRoute allowedRoles={['Employee']}>
              <MyVouchers />
            </RoleRoute>
          }
        />
        <Route
          path="/employee/create-voucher"
          element={
            <RoleRoute allowedRoles={['Employee']}>
              <CreateVoucher />
            </RoleRoute>
          }
        />
        <Route
          path="/employee/edit-voucher"
          element={
            <RoleRoute allowedRoles={['Employee']}>
              <EditVoucher />
            </RoleRoute>
          }
        />

        {/* Director Routes */}
        <Route
          path="/director/dashboard"
          element={
            <RoleRoute allowedRoles={['Director', 'Admin']}>
              <DirectorDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/director/pending"
          element={
            <RoleRoute allowedRoles={['Director', 'Admin']}>
              <PendingApprovals />
            </RoleRoute>
          }
        />
        <Route
          path="/director/vouchers"
          element={
            <RoleRoute allowedRoles={['Director', 'Admin']}>
              <AllVouchersDirector />
            </RoleRoute>
          }
        />

        {/* Accounts Routes */}
        <Route
          path="/accounts/dashboard"
          element={
            <RoleRoute allowedRoles={['Accounts']}>
              <AccountsDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/accounts/vouchers"
          element={
            <RoleRoute allowedRoles={['Accounts']}>
              <AllVouchersAccounts />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
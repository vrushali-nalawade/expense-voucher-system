import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import useAuth from '../hooks/useAuth.js';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);

  // Auto reset scroll position to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-200/90 via-blue-100/40 to-slate-300/80 p-3 sm:p-4 lg:p-5 font-sans antialiased flex flex-col overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto flex-1 h-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-400/20 flex overflow-hidden">
        {/* SIDEBAR MOUNTED ONCE HERE ONLY */}
        <Sidebar
          userRole={user?.role || 'Employee'}
          activePath={location.pathname}
          onNavigate={handleNavigate}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
          <Navbar user={user} onLogout={handleLogout} />
          
          <main ref={mainRef} className="flex-1 p-6 sm:p-8 overflow-y-auto min-h-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
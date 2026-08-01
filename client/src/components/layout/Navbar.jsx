import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, CheckCircle2, Clock, AlertCircle, X, User } from 'lucide-react';
import Badge from '../common/Badge.jsx';

const NOTIF_STORAGE_KEY = 'voucherflow_unread_notification_count';

const Navbar = ({ user = { name: 'Vrushali Nalawade', role: 'Employee', email: 'vrushalinalawade108@gmail.com' }, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const [unreadCount, setUnreadCount] = useState(() => {
    const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
    return stored !== null ? Number(stored) : 3;
  });

  const popoverRef = useRef(null);

  const hideSearchRoutes = [
    '/employee/vouchers',
    '/employee/create-voucher',
    '/employee/edit-voucher',
    '/director/vouchers',
    '/director/pending',
    '/accounts/vouchers',
  ];
  const showTopSearch = !hideSearchRoutes.includes(location.pathname);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    localStorage.setItem(NOTIF_STORAGE_KEY, '0');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const role = user?.role?.toLowerCase();
      let targetPath = '/employee/vouchers';
      if (role === 'director' || role === 'admin') targetPath = '/director/vouchers';
      if (role === 'accounts') targetPath = '/accounts/vouchers';

      navigate(`${targetPath}?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const sampleNotifications = [
    {
      id: 1,
      title: 'Voucher Approved',
      message: 'Voucher VCH-2026-001 (₹3,450.00) was approved.',
      time: '10 mins ago',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 2,
      title: 'Pending Review',
      message: 'Voucher VCH-2026-002 (₹18,500.00) requires Director approval.',
      time: '1 hour ago',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 3,
      title: 'Policy Reminder',
      message: 'Review quarterly expense caps for department budget allocations.',
      time: 'Yesterday',
      icon: AlertCircle,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'director':
      case 'admin':
        return 'purple';
      case 'accounts':
        return 'blue';
      default:
        return 'emerald';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'VN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between transition-all">
      <div className="relative w-72">
        {showTopSearch ? (
          <>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search vouchers, IDs... (Press Enter)"
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50/80 border border-slate-200/60 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
            />
          </>
        ) : <div />}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-400/20 z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {sampleNotifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-start gap-3 border border-slate-100"
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 text-left hover:bg-slate-50 p-1 rounded-xl transition-colors group"
            title="Open Profile Settings"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {user?.name || 'Vrushali Nalawade'}
                </span>
                <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                  {user?.role || 'Employee'}
                </Badge>
              </div>
              <span className="text-[11px] text-slate-400 block">{user?.email || 'vrushalinalawade108@gmail.com'}</span>
            </div>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 ml-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
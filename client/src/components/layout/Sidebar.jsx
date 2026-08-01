import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  CheckSquare, 
  Receipt, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import voucherApi from '../../api/voucherApi.js';

const Sidebar = ({ userRole = 'Employee', activePath = '/dashboard', onNavigate }) => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkPending = async () => {
      try {
        const vouchers = await voucherApi.getVouchers({ status: 'Submitted' });
        setPendingCount(vouchers.length);
      } catch (err) {
        console.error('Failed to fetch pending count for sidebar', err);
      }
    };
    if (userRole?.toLowerCase() === 'director' || userRole?.toLowerCase() === 'admin') {
      checkPending();
    }
  }, [userRole, activePath]);

  const getNavItems = () => {
    switch (userRole?.toLowerCase()) {
      case 'director':
      case 'admin':
        return [
          { label: 'Overview', path: '/director/dashboard', icon: LayoutDashboard },
          { 
            label: 'Pending Approvals', 
            path: '/director/pending', 
            icon: CheckSquare, 
            badge: pendingCount > 0 ? `${pendingCount} Needs Action` : null 
          },
          { label: 'All Vouchers', path: '/director/vouchers', icon: FileText },
        ];
      case 'accounts':
        return [
          { label: 'Accounts Overview', path: '/accounts/dashboard', icon: LayoutDashboard },
          { label: 'Voucher Repository', path: '/accounts/vouchers', icon: Receipt },
        ];
      case 'employee':
      default:
        return [
          { label: 'My Overview', path: '/employee/dashboard', icon: LayoutDashboard },
          { label: 'My Vouchers', path: '/employee/vouchers', icon: FileText },
          { label: 'Create Voucher', path: '/employee/create-voucher', icon: PlusCircle },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 min-w-[16rem] max-w-[16rem] bg-white border-r border-slate-100 flex flex-col h-full shrink-0 select-none">
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">VoucherFlow</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">Enterprise SaaS</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate && onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-200">Role Mode</span>
        </div>
        <p className="text-[11px] text-slate-300 capitalize">{userRole} Portal Access Enabled</p>
      </div>
    </aside>
  );
};

export default Sidebar;
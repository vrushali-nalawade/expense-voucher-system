import React from 'react';
import { Outlet } from 'react-router-dom';
import { Receipt, ShieldCheck } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200/90 via-blue-100/40 to-slate-300/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 mb-1 ring-4 ring-white/60">
            <Receipt className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">VoucherFlow</h1>
          <p className="text-xs text-slate-600 font-medium">
            Expense Voucher Management & Automated Reimbursements
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-slate-300/70">
          <Outlet />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Enterprise Grade Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
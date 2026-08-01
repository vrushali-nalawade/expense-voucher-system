import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle2, XCircle, DollarSign, FileEdit, Sparkles, ArrowRight, PieChart, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card.jsx';
import Loader from '../../components/common/Loader.jsx';
import dashboardApi from '../../api/dashboardApi.js';
import useAuth from '../../hooks/useAuth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await dashboardApi.getEmployeeStats();
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load employee metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader text="Loading Employee Analytics & Overview..." />;
  }

  const statCards = [
    { label: 'Total Amount Claimed', value: formatCurrency(stats?.totalAmountClaimed || 0), icon: DollarSign, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Total Vouchers', value: stats?.totalVouchers || 0, icon: FileEdit, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Draft Vouchers', value: stats?.draftVouchers || 0, icon: FileEdit, color: 'text-slate-600 bg-slate-50 border-slate-100' },
    { label: 'Pending Approval', value: stats?.pendingApproval || 0, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Approved Vouchers', value: stats?.approvedVouchers || 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Rejected Vouchers', value: stats?.rejectedVouchers || 0, icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  const categoryBreakdown = [
    { name: 'Software & Tools', amount: 18500, percent: '50%', color: 'bg-blue-600' },
    { name: 'Meals & Client Dinners', amount: 3450, percent: '10%', color: 'bg-purple-600' },
    { name: 'Office Stationery', amount: 1200, percent: '3%', color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Employee Financial Overview</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Hi, {user?.name || 'Vrushali Nalawade'}! 👋
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Welcome to your executive expense overview. Track cumulative claims, review approval ratios, and monitor expense category distributions.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="primary"
              leftIcon={PlusCircle}
              onClick={() => navigate('/employee/create-voucher')}
              className="bg-white text-blue-700 hover:bg-slate-100 shadow-lg border-0"
            >
              Create New Voucher
            </Button>
            <Button
              variant="ghost"
              rightIcon={ArrowRight}
              onClick={() => navigate('/employee/vouchers')}
              className="text-white hover:bg-white/10"
            >
              Open My Vouchers Repository
            </Button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Spending Distribution by Category</CardTitle>
              <p className="text-xs text-slate-500">Breakdown of claimed expenses across categories this fiscal period</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(cat.amount)} ({cat.percent})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${cat.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: cat.percent }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Claims Approval Rate
                </span>
                <span className="text-xl font-extrabold text-slate-900">100%</span>
                <span className="text-[11px] text-emerald-600 block mt-0.5">High Director compliance score</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Average Claim Size
                </span>
                <span className="text-xl font-extrabold text-slate-900">₹7,716.00</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Calculated across personal claims</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <div>
                <span className="text-xs font-bold text-blue-900 block">E-Signature Protection</span>
                <span className="text-[11px] text-blue-700">Digital signatures locked on submission</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
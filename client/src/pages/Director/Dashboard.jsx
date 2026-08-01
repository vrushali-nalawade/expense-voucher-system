import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, DollarSign, CheckCircle2, XCircle, ArrowRight, Eye, FileText } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Loader from '../../components/common/Loader.jsx';
import StatusBadge from '../../components/voucher/StatusBadge.jsx';
import dashboardApi from '../../api/dashboardApi.js';
import voucherApi from '../../api/voucherApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const DirectorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingVouchers, setPendingVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, vouchers] = await Promise.all([
          dashboardApi.getDirectorStats(),
          voucherApi.getVouchers({ status: 'Submitted' }),
        ]);
        setStats(statsData);
        setPendingVouchers(vouchers.slice(0, 5));
      } catch (err) {
        console.error('Failed to load Director metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader text="Loading Director Analytics Overview..." />;
  }

  const statCards = [
    { label: 'Total Org Vouchers', value: stats?.totalVouchers ?? 0, icon: FileText, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Pending Approval', value: stats?.pendingApprovalCount ?? 0, icon: CheckSquare, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Pending Amount', value: formatCurrency(stats?.totalPendingAmount ?? 0), icon: DollarSign, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Total Approved Amount', value: formatCurrency(stats?.totalApprovedAmount ?? 0), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Approved Claims', value: stats?.approvedToday ?? 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Rejected Claims', value: stats?.rejectedToday ?? 0, icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Director Dashboard"
        subtitle="Review, approve, or reject employee expense reimbursement requests."
      >
        <Button
          variant="primary"
          rightIcon={ArrowRight}
          onClick={() => navigate('/director/pending')}
        >
          View Pending Approvals ({pendingVouchers.length})
        </Button>
      </PageHeader>

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

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Vouchers Awaiting Your Review</h3>
          <button
            onClick={() => navigate('/director/pending')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Manage Approvals Queue →
          </button>
        </div>

        {pendingVouchers.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No pending vouchers awaiting approval.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Voucher No.</th>
                  <th className="py-3 px-4">Expense Title</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Expense Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {pendingVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{v.voucherNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{v.title}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{v.employeeName || 'Self'}</td>
                    <td className="py-3.5 px-4">{v.department}</td>
                    <td className="py-3.5 px-4">{v.expenseDate}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatCurrency(v.amount)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => navigate('/director/pending')}
                      >
                        Show Details / Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DirectorDashboard;
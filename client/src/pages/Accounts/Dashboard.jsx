import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, CheckCircle2, Clock, XCircle, ArrowRight, Eye, FileText } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Loader from '../../components/common/Loader.jsx';
import StatusBadge from '../../components/voucher/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import dashboardApi from '../../api/dashboardApi.js';
import voucherApi from '../../api/voucherApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const AccountsDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [approvedVouchers, setApprovedVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, vouchers] = await Promise.all([
          dashboardApi.getAccountsStats(),
          voucherApi.getVouchers({ status: 'Approved' }),
        ]);
        setStats(statsData);
        setApprovedVouchers(vouchers.slice(0, 5));
      } catch (err) {
        console.error('Failed to load Accounts metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader text="Loading Accounts Reimbursement Overview..." />;
  }

  // Cards required by Section 8 of Assignment Spec
  const statCards = [
    { label: 'Approved Reimbursement Total', value: formatCurrency(stats?.totalApprovedExpenseAmount ?? 0), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Total Vouchers', value: stats?.totalVouchers ?? 0, icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Pending Approvals', value: stats?.pendingApproval ?? 0, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Approved Vouchers', value: stats?.approvedVouchers ?? 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Rejected Vouchers', value: stats?.rejectedVouchers ?? 0, icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Accounts Team Dashboard"
        subtitle="Monitor approved expense vouchers ready for financial payout processing."
      >
        <Button
          variant="primary"
          rightIcon={ArrowRight}
          onClick={() => navigate('/accounts/vouchers')}
        >
          View All Organization Vouchers →
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
          <h3 className="text-base font-bold text-slate-900">Vouchers Approved for Reimbursement</h3>
          <button
            onClick={() => navigate('/accounts/vouchers')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Explore Repository →
          </button>
        </div>

        {approvedVouchers.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No approved vouchers awaiting reimbursement processing.</p>
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
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {approvedVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{v.voucherNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{v.title}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{v.employeeName || 'Vrushali Nalawade'}</td>
                    <td className="py-3.5 px-4">{v.department}</td>
                    <td className="py-3.5 px-4">{v.expenseDate}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatCurrency(v.amount)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => setSelectedVoucher(v)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        title={`Audit Reimbursement: ${selectedVoucher?.voucherNumber || ''}`}
        subtitle={selectedVoucher?.title}
      >
        {selectedVoucher && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Approved Amount</span>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(selectedVoucher.amount)}</span>
              </div>
              <StatusBadge status={selectedVoucher.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="font-semibold text-slate-900 block">Employee</span>
                <span>{selectedVoucher.employeeName || 'Vrushali Nalawade'} ({selectedVoucher.department})</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Approval Date</span>
                <span>{selectedVoucher.approvalDate || selectedVoucher.expenseDate}</span>
              </div>
            </div>

            {selectedVoucher.signatureUrl && (
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Employee Signature</span>
                <img src={selectedVoucher.signatureUrl} alt="Employee Signature" className="h-16 object-contain border rounded-lg p-2 bg-slate-50" />
              </div>
            )}

            {selectedVoucher.directorSignatureUrl && (
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Director Approval Signature</span>
                <img src={selectedVoucher.directorSignatureUrl} alt="Director Signature" className="h-16 object-contain border rounded-lg p-2 bg-slate-50" />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccountsDashboard;
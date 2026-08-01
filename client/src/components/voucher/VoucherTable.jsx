import React from 'react';
import { Eye, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';

const VoucherTable = ({
  vouchers = [],
  userRole = 'Employee',
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isLoading = false,
}) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const getEmployeeDisplayName = (v) => {
    if (userRole?.toLowerCase() === 'employee') {
      return v.employeeName === 'Vrushali Nalawade' || v.employeeName === 'Self' ? 'Self' : (v.employeeName || 'Self');
    }
    // Show full employee names for Director and Accounts views
    return v.employeeName || 'Vrushali Nalawade';
  };

  if (!isLoading && vouchers.length === 0) {
    return (
      <EmptyState
        title="No expense vouchers found"
        description="There are currently no vouchers matching your filter criteria."
      />
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Voucher No.</th>
              <th className="py-3.5 px-4">Expense Title</th>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Expense Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {vouchers.map((v) => {
              const isDraft = v.status?.toLowerCase() === 'draft';
              const isPending = v.status?.toLowerCase() === 'submitted' || v.status?.toLowerCase() === 'pending approval';

              return (
                <tr key={v.id || v.voucherNumber} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">
                    {v.voucherNumber || `VCH-${v.id}`}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{v.title}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {getEmployeeDisplayName(v)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{v.department}</td>
                  <td className="py-3.5 px-4 text-slate-600">{v.expenseDate}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(v.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={v.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => onView && onView(v)}
                      >
                        View
                      </Button>

                      {userRole?.toLowerCase() === 'employee' && isDraft && (
                        <>
                          {onEdit && (
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={Edit3}
                              onClick={() => onEdit(v)}
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="danger"
                              size="sm"
                              leftIcon={Trash2}
                              onClick={() => onDelete(v)}
                            />
                          )}
                        </>
                      )}

                      {(userRole?.toLowerCase() === 'director' || userRole?.toLowerCase() === 'admin') && isPending && (
                        <>
                          {onReject && (
                            <Button
                              variant="danger"
                              size="sm"
                              leftIcon={XCircle}
                              onClick={() => onReject(v)}
                            >
                              Reject
                            </Button>
                          )}
                          {onApprove && (
                            <Button
                              variant="success"
                              size="sm"
                              leftIcon={CheckCircle}
                              onClick={() => onApprove(v)}
                            >
                              Approve
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherTable;
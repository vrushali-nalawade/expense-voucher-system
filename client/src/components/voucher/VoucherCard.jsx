import React from 'react';
import { Eye, Edit3, Trash2, Calendar, Building2, User, Check, X } from 'lucide-react';
import Card, { CardHeader, CardContent, CardFooter } from '../common/Card';
import StatusBadge from './StatusBadge';
import Button from '../common/Button';

const VoucherCard = ({
  voucher,
  userRole = 'Employee',
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  if (!voucher) return null;

  const {
    id,
    voucherNumber,
    title,
    department,
    expenseDate,
    amount,
    status = 'Draft',
    employeeName,
  } = voucher;

  const isDraft = status?.toLowerCase() === 'draft';
  const isPending = status?.toLowerCase() === 'submitted' || status?.toLowerCase() === 'pending approval';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <Card className="hover:border-blue-200 transition-all duration-200 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <div>
          <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {voucherNumber || `VCH-${id}`}
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{title}</h4>
        </div>
        <StatusBadge status={status} size="sm" />
      </CardHeader>

      <CardContent className="py-3 space-y-2.5">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{expenseDate}</span>
          </div>
        </div>

        {employeeName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{employeeName}</span>
          </div>
        )}

        <div className="pt-2 flex items-baseline justify-between">
          <span className="text-xs text-slate-400">Total Claim</span>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(amount)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={Eye}
          onClick={() => onView && onView(voucher)}
        >
          View
        </Button>

        {userRole?.toLowerCase() === 'employee' && isDraft && (
          <div className="flex items-center gap-1.5">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={Edit3}
                onClick={() => onEdit(voucher)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={Trash2}
                onClick={() => onDelete(voucher)}
              />
            )}
          </div>
        )}

        {(userRole?.toLowerCase() === 'director' || userRole?.toLowerCase() === 'admin') && isPending && (
          <div className="flex items-center gap-1.5">
            {onReject && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={X}
                onClick={() => onReject(voucher)}
              >
                Reject
              </Button>
            )}
            {onApprove && (
              <Button
                variant="success"
                size="sm"
                leftIcon={Check}
                onClick={() => onApprove(voucher)}
              >
                Approve
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default VoucherCard;
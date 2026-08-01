import React from 'react';
import { FileEdit, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Badge from '../common/Badge';

const StatusBadge = ({ status = 'Draft', size = 'md', className = '' }) => {
  const getStatusConfig = (statusStr) => {
    const formatted = statusStr?.toString().toLowerCase() || 'draft';
    switch (formatted) {
      case 'approved':
        return { variant: 'emerald', label: 'Approved', icon: CheckCircle2 };
      case 'rejected':
        return { variant: 'rose', label: 'Rejected', icon: XCircle };
      case 'submitted':
      case 'pending approval':
      case 'pending':
        return { variant: 'amber', label: 'Pending Approval', icon: Clock };
      case 'draft':
      default:
        return { variant: 'slate', label: 'Draft', icon: FileEdit };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={config.icon}
      className={className}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
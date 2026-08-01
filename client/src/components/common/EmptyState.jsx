import React from 'react';
import { FileQuestion } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FileQuestion,
  title = 'No records found',
  description = 'There are no items to display right now.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} leftIcon={actionIcon} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
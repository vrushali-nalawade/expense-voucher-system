import React from 'react';

const variantClasses = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
  amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-xs font-bold',
};

export const Badge = ({
  children,
  variant = 'slate',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const vClass = variantClasses[variant] || variantClasses.slate;
  const sClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${vClass} ${sClass} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;

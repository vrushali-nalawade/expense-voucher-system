import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase text-slate-600">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <input
          ref={ref}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-xs bg-slate-50 border ${
            error ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20'
          } rounded-xl focus:outline-none focus:ring-2 font-medium transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

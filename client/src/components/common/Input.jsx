import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`block w-full rounded-xl text-sm text-slate-900 bg-slate-50/50 border transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            LeftIcon ? 'pl-10' : 'pl-3.5'
          } ${RightIcon ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 focus:border-blue-500'
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-rose-500 animate-fadeIn">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
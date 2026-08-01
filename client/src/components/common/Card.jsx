import React from 'react';

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pb-4 border-b border-slate-100/80 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-slate-500 mt-1 ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pt-4 border-t border-slate-100/80 bg-slate-50/50 rounded-b-2xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
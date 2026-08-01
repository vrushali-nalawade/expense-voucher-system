import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
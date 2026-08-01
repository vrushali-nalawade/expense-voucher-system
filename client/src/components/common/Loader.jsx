import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({
  size = 'md',
  fullPage = false,
  text = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-blue-600`} />
      {text && <p className="text-xs font-medium text-slate-500 tracking-wide">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-xs">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex justify-center items-center w-full">{spinner}</div>;
};

export default Loader;
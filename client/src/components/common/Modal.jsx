import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all animate-scaleUp border border-slate-100 p-6`}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
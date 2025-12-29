import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext({
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  showToast: () => {},
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: message => addToast(message, 'success'),
    error: message => addToast(message, 'error'),
    info: message => addToast(message, 'info'),
    warning: message => addToast(message, 'warning'),
    showToast: (message, type = 'info') => addToast(message, type),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle2 size={20} className="text-green-600" />,
    error: <AlertCircle size={20} className="text-red-600" />,
    warning: <AlertTriangle size={20} className="text-yellow-600" />,
    info: <Info size={20} className="text-blue-600" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`flex items-center gap-3 min-w-[320px] p-4 rounded-lg border shadow-lg ${styles[type]} animate-slide-in`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  onClose: PropTypes.func.isRequired,
};

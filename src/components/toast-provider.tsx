import * as React from 'react';
import { useState, useCallback } from 'react';
import Toast from './ui/toast';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
  duration: number;
  open: boolean;
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'error', duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Component riêng để render toasts
const ToastList: React.FC<{
  toasts: Toast[];
  handleOpenChange: (id: string, open: boolean) => void;
}> = React.memo(({ toasts, handleOpenChange }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          open={toast.open}
          onOpenChange={(open) => handleOpenChange(toast.id, open)}
        />
      ))}
    </div>
  );
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success', duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration, open: true }]);
    },
    []
  );

  const handleOpenChange = useCallback((id: string, open: boolean) => {
    if (!open) {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastList toasts={toasts} handleOpenChange={handleOpenChange} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
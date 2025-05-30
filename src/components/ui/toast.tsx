import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

interface CustomToastProps {
  message: string;
  type?: 'success' | 'error';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration?: number;
}

const CustomToast: React.FC<CustomToastProps> = ({
  message,
  type = 'success',
  open,
  onOpenChange,
  duration = 3000,
}) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={cn(
          'p-4 rounded-md shadow-lg flex items-center justify-between border',
          'animate-slide-in data-[state=closed]:animate-slide-out',
          type === 'success'
            ? 'bg-emerald-500 text-white border-gray-200 dark:bg-emerald-700 dark:text-gray-100 dark:border-gray-700'
            : 'bg-rose-500 text-white border-gray-200 dark:bg-rose-700 dark:text-gray-100 dark:border-gray-700'
        )}
        open={open}
        onOpenChange={onOpenChange}
        duration={duration}
      >
        <Toast.Description>{message}</Toast.Description>
        <Toast.Close
          className={cn(
            'ml-4',
            type === 'success'
              ? 'text-white hover:text-gray-200 dark:text-gray-100 dark:hover:text-gray-300'
              : 'text-white hover:text-gray-200 dark:text-gray-100 dark:hover:text-gray-300'
          )}
        >
          ✕
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed top-4 right-4 z-50" />
    </Toast.Provider>
  );
};

export default CustomToast;

// CSS animations
const styles = `
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slide-out {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  .animate-slide-out {
    animation: slide-out 0.3s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
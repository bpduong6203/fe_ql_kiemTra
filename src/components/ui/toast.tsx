import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon, XCircleIcon, InfoIcon } from 'lucide-react';

interface CustomToastProps {
  message: string;
  type?: 'success' | 'error' | 'info'; 
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
  const icon = React.useMemo(() => {
    switch (type) {
      case 'success':
        return <CheckCircle2Icon className="size-5 text-emerald-600 dark:text-emerald-400" />;
      case 'error':
        return <XCircleIcon className="size-5 text-rose-600 dark:text-rose-400" />;
      case 'info':
        return <InfoIcon className="size-5 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  }, [type]);

  const textColorClass = React.useMemo(() => {
    switch (type) {
      case 'success':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'error':
        return 'text-rose-600 dark:text-rose-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-foreground';
    }
  }, [type]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={cn(
          'p-4 rounded-md shadow-lg flex items-center justify-between border',
          'animate-slide-in data-[state=closed]:animate-slide-out',
          'bg-background text-foreground border-border', 
          {
            'border-emerald-300 dark:border-emerald-700': type === 'success',
            'border-rose-300 dark:border-rose-700': type === 'error',
            'border-blue-300 dark:border-blue-700': type === 'info',
          }
        )}
        open={open}
        onOpenChange={onOpenChange}
        duration={duration}
      >
        <div className="flex items-center gap-2">
          {icon} {/* Hiển thị icon */}
          <Toast.Description className={cn(textColorClass)}>{message}</Toast.Description>
        </div>
        
        <Toast.Close
          className={cn(
            'ml-4 text-muted-foreground hover:text-foreground', 
            textColorClass
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
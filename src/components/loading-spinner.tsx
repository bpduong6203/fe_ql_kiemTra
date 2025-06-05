import React, { lazy, Suspense } from 'react';
import loading1 from '@/assets/Animation - 1748074983693.json';
import loading2 from '@/assets/Animation - 1749109042086.json';

const Player = lazy(() => import('lottie-react'));

interface LoadingSpinnerProps {
  variant?: 1 | 2 ;
  withOverlay?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 1,
  withOverlay = true,
  className,
}) => {
  if (typeof window === 'undefined') return null;

  const animations = {
    1: loading1,
    2: loading2,
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Player
          autoplay
          loop
          animationData={animations[variant]}
          style={{ height: '150px', width: '150px', background: 'transparent' }}
        />
      </Suspense>
    </div>
  );

  if (!withOverlay) {
    return <div className={className}>{spinner}</div>;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      className={className}
    >
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
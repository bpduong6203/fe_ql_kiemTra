import React, { lazy, Suspense } from 'react';
import loading1 from '@/assets/Animation - 1747880950855.json';
import loading2 from '@/assets/Animation - 1748074983693.json';
import loading3 from '@/assets/Animation - 1744082020798.json';

const Player = lazy(() => import('lottie-react'));

interface LoadingSpinnerProps {
  variant?: 1 | 2 | 3;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ variant = 1 }) => {
  if (typeof window === 'undefined') return null;

  const animations = {
    1: loading1,
    2: loading2,
    3: loading3,
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ background: 'transparent' }} 
    >
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
};

export default LoadingSpinner;
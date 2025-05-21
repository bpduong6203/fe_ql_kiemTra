import React, { lazy, Suspense } from 'react';
import loading1 from '../../public/Animation - 1744078550421.json';
import loading2 from '../../public/Animation - 1744044635920.json';
import loading3 from '../../public/Animation - 1744044747907.json';
import loading4 from '../../public/Animation - 1744082020798.json';

// Dynamic import với React lazy
const Player = lazy(() => import('lottie-react'));

interface LoadingSpinnerProps {
  variant?: 1 | 2 | 3 | 4;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ variant = 1 }) => {
  if (typeof window === 'undefined') return null;

  const animations = {
    1: loading1,
    2: loading2,
    3: loading3,
    4: loading4,
  };

  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Player
          autoplay
          loop
          animationData={animations[variant]}
          style={{ height: '150px', width: '150px' }}
        />
      </Suspense>
    </div>
  );
};

export default LoadingSpinner;
import React from 'react';
import Lottie from 'lottie-react'; 
import animationData from '../assets/Animation - 1749175752835.json'; 

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: props.width || 100, height: props.height || 100 }} 
      {...props}
    />
  );
}
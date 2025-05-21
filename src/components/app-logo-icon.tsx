import React from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} src="/logo.png" alt="App Logo" width={100} height={100} />;
}
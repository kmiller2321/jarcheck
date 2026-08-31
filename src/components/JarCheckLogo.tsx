import React, { useState } from 'react';

interface JarCheckLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

// Only the SVG source is used -- it's the intact, real logo file.
// (The .png exports of this logo were corrupted during a prior export
// and could not be recovered; the SVG is also the sharper choice for
// a logo anyway, since it scales to any size with no quality loss.)
const LOGO_SRC = '/images/Logo/jarcheck-logo4x.png';

export const JarCheckLogo: React.FC<JarCheckLogoProps> = ({
  variant = 'light',
  size = 'md',
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const heights = {
    sm: 'h-7 sm:h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
  };

  return (
    <div
      className={`inline-flex items-center select-none ${
        variant === 'dark'
          ? 'bg-white/95 px-3 py-1.5 rounded-xl shadow-sm border border-white/20'
          : ''
      } ${className}`}
    >
      {!imgFailed ? (
        <img
          src={LOGO_SRC}
          alt="JarCheck Logo"
          className={`${heights[size]} w-auto object-contain max-h-16`}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="flex items-center gap-2 font-black tracking-tight text-amber-900">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            JC
          </div>
          <span className="text-xl font-bold text-slate-900">
            Jar<span className="text-amber-600">Check</span>
          </span>
        </div>
      )}
    </div>
  );
};

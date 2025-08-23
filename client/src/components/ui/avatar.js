import React from 'react';

export function Avatar({ name, size = 40, className = '' }) {
  const initial = name?.charAt(0) || 'U';
  const sz = typeof size === 'number' ? `${size}px` : size;
  
  // Check if className contains a background color, if not use default
  const hasCustomBg = className.includes('bg-');
  const defaultClasses = hasCustomBg ? '' : 'bg-primary-600';
  const textColor = 'text-white';
  
  return (
    <div style={{ width: sz, height: sz }} className={`rounded-full ${defaultClasses} flex items-center justify-center ${className}`}>
      <span className={`${textColor} font-medium`}>{initial}</span>
    </div>
  );
}

export default Avatar;

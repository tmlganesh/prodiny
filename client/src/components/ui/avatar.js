import React from 'react';

export function Avatar({ name, size = 40, className = '' }) {
  const initial = name?.charAt(0) || 'U';
  const sz = typeof size === 'number' ? `${size}px` : size;
  return (
    <div style={{ width: sz, height: sz }} className={`rounded-full bg-gray-300 flex items-center justify-center ${className}`}>
      <span className="text-gray-700 font-medium">{initial}</span>
    </div>
  );
}

export default Avatar;

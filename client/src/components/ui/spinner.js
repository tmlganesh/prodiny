import React from 'react';

export function Spinner({ size = 24, className = '' }) {
  const sz = typeof size === 'number' ? `${size}px` : size;
  return (
    <div style={{ width: sz, height: sz }} className={`animate-spin rounded-full border-4 border-gray-300 border-t-transparent ${className}`} />
  );
}

export default Spinner;

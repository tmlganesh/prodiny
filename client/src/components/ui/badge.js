import React from 'react';

export function Badge({ children, color = 'gray', className = '' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
  };
  return <span className={`px-2 py-1 rounded-full text-xs ${colors[color] || colors.gray} ${className}`}>{children}</span>;
}

export default Badge;

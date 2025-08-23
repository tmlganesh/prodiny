import React from 'react';

export function Badge({ children, color = 'gray', className = '' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-success-50 text-success-700 border-success-200',
    blue: 'bg-primary-50 text-primary-700 border-primary-200',
    red: 'bg-error-50 text-error-700 border-error-200',
    yellow: 'bg-warning-50 text-warning-700 border-warning-200',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colors[color] || colors.gray} ${className}`}>{children}</span>;
}

export default Badge;

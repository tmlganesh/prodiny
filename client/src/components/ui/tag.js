import React from 'react';

export function Tag({ children, className = '' }) {
  return <span className={`px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full ${className}`}>{children}</span>;
}

export default Tag;

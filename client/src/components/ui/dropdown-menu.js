import React from 'react';
import { cn } from '../../utils/cn';

const DropdownMenu = ({ children, className }) => {
  return <div className={cn("relative inline-block text-left", className)}>{children}</div>;
};

const DropdownMenuTrigger = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={cn("inline-flex justify-center", className)}>
      {children}
    </button>
  );
};

const DropdownMenuContent = ({ children, isOpen, className }) => {
  if (!isOpen) return null;
  
  return (
    <div className={cn(
      "absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50",
      className
    )}>
      <div className="py-1" role="menu">
        {children}
      </div>
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      role="menuitem"
    >
      {children}
    </button>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };

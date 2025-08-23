import React from 'react';
import { cn } from '../../utils/cn';

export function Sidebar({ children, className = '', ...props }) {
  return (
    <div className={cn("flex h-full w-64 flex-col bg-white border-r border-gray-200", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarHeader({ children, className = '', ...props }) {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-3 border-b border-gray-200", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className = '', ...props }) {
  return (
    <div className={cn("flex-1 overflow-auto py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarNav({ children, className = '', ...props }) {
  return (
    <nav className={cn("space-y-1 px-2", className)} {...props}>
      {children}
    </nav>
  );
}

export function SidebarNavItem({ 
  children, 
  icon: Icon, 
  active = false, 
  className = '', 
  onClick,
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active 
          ? "bg-primary-100 text-primary-900" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

export function SidebarSection({ title, children, className = '', ...props }) {
  return (
    <div className={cn("px-2 py-2", className)} {...props}>
      {title && (
        <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className = '', ...props }) {
  return (
    <div className={cn("border-t border-gray-200 p-4", className)} {...props}>
      {children}
    </div>
  );
}
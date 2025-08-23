import React from 'react';
import { cn } from '../../utils/cn';

const Tabs = ({ children, className, ...props }) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
};

const TabsList = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-white p-1 text-black",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ children, value, isActive, onClick, className, ...props }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-white text-black shadow-sm" 
          : "text-black hover:text-black",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeTab, className, ...props }) => {
  if (value !== activeTab) return null;
  
  return (
    <div 
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

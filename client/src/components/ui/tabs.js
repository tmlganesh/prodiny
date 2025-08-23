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
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
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
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-background text-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground",
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
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

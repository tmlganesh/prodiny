import React from "react";

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return <div className={`p-6 pb-0 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = '', ...props }) {
  return <h2 className={`text-2xl font-semibold text-gray-900 ${className}`} {...props}>{children}</h2>;
}

export function CardDescription({ children, className = '', ...props }) {
  return <p className={`text-gray-600 text-sm mt-1 ${className}`} {...props}>{children}</p>;
}

export function CardAction({ children, className = '', ...props }) {
  return <div className={`mt-2 ${className}`} {...props}>{children}</div>;
}

export function CardContent({ children, className = '', ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className = '', ...props }) {
  return <div className={`p-6 pt-0 flex ${className}`} {...props}>{children}</div>;
}

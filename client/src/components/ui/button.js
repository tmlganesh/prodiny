import React from "react";

export function Button({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default', 
  as: Component = 'button',
  ...props 
}) {
  let base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  let variants = {
    default: "bg-primary-600 text-white hover:bg-primary-700 shadow-soft hover:shadow-medium",
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-soft hover:shadow-medium",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400",
    ghost: "text-gray-600 bg-transparent hover:bg-gray-100 hover:text-gray-900",
    link: "text-primary-600 bg-transparent hover:text-primary-700 underline-offset-4 hover:underline p-0 h-auto text-sm",
  };

  let sizes = {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const sizeClass = sizes[size] || sizes.default;
  const cls = `${base} ${variants[variant] || ''} ${sizeClass} ${className}`;
  
  return (
    <Component className={cls} {...props}>
      {children}
    </Component>
  );
}

export default Button;

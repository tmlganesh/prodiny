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
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  let variants = {
    default: "bg-white text-black hover:bg-gray-200",
    primary: "bg-black text-white hover:opacity-95",
    outline: "border border-white text-white bg-black hover:bg-gray-900",
    link: "underline text-white bg-black hover:text-gray-300 p-0 h-auto text-xs",
  };

  let sizes = {
    sm: 'px-2 py-1 text-xs rounded-sm',
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

import React from "react";

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`bg-black text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400 ${className}`}
    {...props}
  />
));

import React from "react";

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`bg-white text-black border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black placeholder-black ${className}`}
    {...props}
  />
));

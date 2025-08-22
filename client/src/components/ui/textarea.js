import React from 'react';

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`bg-white text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 ${className}`}
    {...props}
  />
));

export default Textarea;
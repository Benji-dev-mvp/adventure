import React from 'react';
import { ArrowRight } from 'lucide-react';

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'gradient', 
  className = '',
  disabled = false,
  ...props 
}) => {
  const variants = {
    gradient: 'bg-gradient-magenta hover:shadow-xl text-white',
    purple: 'bg-artisan-purple hover:bg-artisan-purple-dark text-white',
    outline: 'border-2 border-gray-300 hover:border-artisan-purple hover:text-artisan-purple bg-white text-gray-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative flex items-center justify-center gap-3 
        font-bold rounded-full py-3 px-6 
        transition-all duration-300 transform hover:scale-[1.02]
        ${variants[variant]} 
        ${className}
      `}
      {...props}
    >
      <span aria-disabled={disabled}>{children}</span>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20">
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
};

export { AnimatedButton };
export default AnimatedButton;

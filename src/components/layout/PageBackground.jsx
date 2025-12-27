import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const PageBackground = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gray-50'}`}>
      {/* Animated background elements - only show in dark mode */}
      {theme === 'dark' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;

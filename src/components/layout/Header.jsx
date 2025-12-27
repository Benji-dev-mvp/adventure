import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';

const Header = ({ title, subtitle }) => {
  return (
    <header className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          {title && <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search leads, campaigns..."
              className="pl-10 pr-4 py-2 w-80 rounded-xl border border-gray-300 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>

          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

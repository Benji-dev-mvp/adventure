import React, { useState } from 'react';
import { Search, User, Moon, Sun, Command } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { NotificationBell } from '../activity';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { TaskTrigger, TaskSidebar } from '../tasks';
import { WhatsNewBadge } from '../../pages/Changelog';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle, onOpenCommandPalette }) => {
  const { theme, toggleTheme } = useTheme();
  const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Count of incomplete tasks (mock)
  const incompleteTasks = 4;

  return (
    <>
      <header className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Workspace Switcher */}
            <WorkspaceSwitcher />

            <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

            <div>
              {title && (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* What's New Badge */}
            <WhatsNewBadge onClick={() => navigate('/changelog')} />

            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl transition-colors"
              title="Open Command Palette (⌘K)"
            >
              <Search size={16} />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded">
                <Command size={10} />K
              </kbd>
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

            {/* Task Trigger */}
            <TaskTrigger onClick={() => setIsTaskSidebarOpen(true)} count={incompleteTasks} />

            {/* Notification Bell */}
            <NotificationBell />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* User Profile */}
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              aria-label="User profile"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Task Sidebar */}
      <TaskSidebar isOpen={isTaskSidebarOpen} onClose={() => setIsTaskSidebarOpen(false)} />
    </>
  );
};

export default Header;

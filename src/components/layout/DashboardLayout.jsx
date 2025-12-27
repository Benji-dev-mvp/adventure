import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import { 
  Home, Target, Users, Database, BarChart3, Settings, 
  MessageSquare, Sparkles, Zap, FileCode, Shield, Brain,
  Rocket, ChevronDown, Menu, X, Sun, Moon
} from 'lucide-react';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Brain, label: 'Ava AI', path: '/ava', highlight: true },
    { icon: Target, label: 'Campaigns', path: '/campaigns' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Database, label: 'Database', path: '/lead-database' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'AI Chat', path: '/ai-assistant' },
    { 
      icon: Zap, 
      label: 'More', 
      submenu: [
        { icon: Rocket, label: 'Exceptional', path: '/exceptional' },
        { icon: Rocket, label: 'Advanced', path: '/advanced' },
        { icon: Zap, label: 'Integrations', path: '/integrations' },
        { icon: FileCode, label: 'Templates', path: '/templates' },
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: Shield, label: 'Admin', path: '/admin' },
      ]
    },
  ];
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Minimal Top Navigation */}
      <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border-b shadow-sm`}>
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Artisan
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                if (item.submenu) {
                  return (
                    <div key="more" className="relative group">
                      <button className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      )}>
                        <Icon size={16} />
                        <span>More</span>
                        <ChevronDown size={14} />
                      </button>
                      
                      {/* Dropdown */}
                      <div className={cn(
                        "absolute top-full right-0 mt-2 w-48 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all",
                        theme === 'dark' ? 'bg-slate-800 border border-white/10' : 'bg-white border border-gray-200'
                      )}>
                        <div className="py-2">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                                  isSubActive 
                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                    : theme === 'dark'
                                      ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                )}
                              >
                                <SubIcon size={16} />
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all relative",
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-white/10'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {item.highlight && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                )}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 rounded-lg transition-colors",
                  theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                )}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={cn(
            "md:hidden border-t",
            theme === 'dark' ? 'border-white/10 bg-slate-900' : 'border-gray-200 bg-white'
          )}>
            <div className="px-4 py-4 space-y-1">
              {navItems.flatMap((item) => {
                if (item.submenu) {
                  return item.submenu;
                }
                return [item];
              }).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all",
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-white/10'
                          : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

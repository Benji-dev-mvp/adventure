import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  Home, 
  Target, 
  Users, 
  Database,
  BarChart3, 
  Settings, 
  MessageSquare, 
  Sparkles,
  Zap,
  FileCode,
  Shield,
  Brain,
  TrendingUp,
  ArrowRight,
  Activity,
  Rocket
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [aiMetrics, setAiMetrics] = useState({
    campaignsAnalyzed: 0,
    leadsProcessed: 0,
    insights: 0,
    learningProgress: 0
  });

  // Simulate AI learning progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAiMetrics(prev => ({
        campaignsAnalyzed: Math.min(prev.campaignsAnalyzed + 1, 12),
        leadsProcessed: Math.min(prev.leadsProcessed + Math.floor(Math.random() * 5), 847),
        insights: Math.min(prev.insights + (Math.random() > 0.7 ? 1 : 0), 23),
        learningProgress: Math.min(prev.learningProgress + 0.5, 100)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Brain, label: 'Ava AI BDR', path: '/ava', highlight: true, badge: '🤖' },
    { icon: Zap, label: 'Exceptional Features', path: '/exceptional', highlight: true, badge: '🚀' },
    { icon: Target, label: 'Campaigns', path: '/campaigns' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Database, label: 'Lead Database', path: '/lead-database' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/ai-assistant' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: TrendingUp, label: 'AI Salesboard', path: '/ai-salesboard', highlight: true, badge: 'New' },
    { icon: Brain, label: 'Knowledge Fusion', path: '/knowledge-fusion', highlight: true, badge: 'AI' },
    { icon: Rocket, label: 'Advanced Hub', path: '/advanced', highlight: true },
    { icon: Zap, label: 'Integrations', path: '/integrations' },
    { icon: FileCode, label: 'Templates', path: '/templates' },
    { icon: Activity, label: 'Releases', path: '/releases' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Shield, label: 'Admin', path: '/admin', adminOnly: true },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl border-r border-gray-200 dark:border-white/10 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-primary-500 dark:text-white">Artisan</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                isActive
                  ? 'bg-accent-50 dark:bg-accent-500/20 text-accent-600 dark:text-accent-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10',
                item.highlight && 'relative'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.highlight && !item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                  AI
                </span>
              )}
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-3 text-white shadow-lg">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
          </div>

          {/* Content */}
          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <Brain size={18} className="animate-pulse" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm">Ava AI</span>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <Activity size={10} />
                  <span>Learning</span>
                </div>
              </div>
            </div>

            {/* Compact Metrics */}
            <div className="flex items-center justify-between text-xs mb-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <div className="text-center">
                <div className="font-bold text-sm">{aiMetrics.campaignsAnalyzed}</div>
                <div className="text-white/70">Campaigns</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="font-bold text-sm">{aiMetrics.leadsProcessed}</div>
                <div className="text-white/70">Leads</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="font-bold text-sm">{aiMetrics.insights}</div>
                <div className="text-white/70">Insights</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Progress</span>
                <span>{Math.round(aiMetrics.learningProgress)}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${aiMetrics.learningProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Single Action Button */}
            <button 
              onClick={() => navigate('/ai-assistant')}
              className="w-full bg-white hover:bg-white/90 text-purple-700 text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-md"
            >
              <MessageSquare size={14} />
              <span>Chat with Ava</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Help Center Link */}
        <button
          onClick={() => navigate('/help')}
          className="w-full mt-3 text-xs text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors flex items-center justify-center gap-2 py-2"
        >
          <MessageSquare size={14} />
          Help & Documentation
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

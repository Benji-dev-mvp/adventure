import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getFilteredSections, getEmphasizedSections } from '@/config/navConfig';
import { useTenant } from '@/contexts/TenantContext';
import { useNavAnalytics } from '@/hooks/useNavAnalytics';
import { useReducedMotion } from '@/hooks/useMotion';
import { Sparkles, Brain, Activity, ArrowRight, MessageSquare } from 'lucide-react';

/**
 * Sidebar Component - Unified Navigation from navConfig
 *
 * Renders grouped sections (Overview, AI Operator, Revenue Engine, Ops & Control)
 * with a compact, "futuristic" workspace design including badges and subtle glow.
 *
 * Features:
 * - Plan-based filtering (startup/midmarket/enterprise)
 * - Section emphasis based on segment
 * - Navigation analytics tracking
 * - Reduced motion support
 */
const Sidebar = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const { isAdmin, plan, tenant } = useTenant();
  const { trackNavClick } = useNavAnalytics({
    tenantId: tenant?.id,
    plan,
  });
  const prefersReducedMotion = useReducedMotion();

  // Get filtered sections based on plan and admin status
  const sections = getFilteredSections(isAdmin, plan);
  const emphasizedSections = getEmphasizedSections(plan);

  const [aiMetrics, setAiMetrics] = useState({
    campaignsAnalyzed: 0,
    leadsProcessed: 0,
    insights: 0,
    learningProgress: 0,
  });

  // Simulate AI learning progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAiMetrics(prev => ({
        campaignsAnalyzed: Math.min(prev.campaignsAnalyzed + 1, 12),
        leadsProcessed: Math.min(prev.leadsProcessed + Math.floor(Math.random() * 5), 847),
        insights: Math.min(prev.insights + (Math.random() > 0.7 ? 1 : 0), 23),
        learningProgress: Math.min(prev.learningProgress + 0.5, 100),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (item, sectionId) => {
    trackNavClick(item.id, sectionId, item.path);
  };

  return (
    <aside
      className={cn(
        'h-screen border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-800">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="text-white" size={18} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wide text-slate-400">Ava Outbound OS</span>
            <span className="text-sm font-semibold text-slate-50 truncate">
              {tenant?.name || 'Workspace'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {sections.map(section => {
          const isEmphasized = emphasizedSections.includes(section.id);
          return (
            <div key={section.id}>
              {!isCollapsed && (
                <div
                  className={cn(
                    'px-3 mb-2 text-[10px] font-medium uppercase tracking-[0.16em]',
                    isEmphasized ? 'text-cyan-400' : 'text-slate-500'
                  )}
                >
                  {section.label}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map(item => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    sectionId={section.id}
                    isCollapsed={isCollapsed}
                    isEmphasized={isEmphasized}
                    onNavigate={handleNavClick}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* AI Status Card */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-3 text-white shadow-lg">
            {/* Animated Background Pattern */}
            <div className={cn('absolute inset-0 opacity-10', prefersReducedMotion && 'hidden')}>
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
                <ArrowRight
                  size={12}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Help Center Link */}
          <button
            onClick={() => navigate('/help')}
            className="w-full mt-3 text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 py-2"
          >
            <MessageSquare size={14} />
            Help & Documentation
          </button>
        </div>
      )}
    </aside>
  );
};

/**
 * Individual Sidebar Item with NavLink for active state
 * Includes analytics tracking and motion support
 */
function SidebarItem({
  item,
  sectionId,
  isCollapsed,
  isEmphasized,
  onNavigate,
  prefersReducedMotion,
}) {
  const Icon = item.icon;

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(item, sectionId);
    }
  };

  return (
    <NavLink
      to={item.path}
      onClick={handleClick}
      className={({ isActive }) =>
        cn(
          'group flex items-center rounded-lg px-3 py-2 text-sm',
          'border border-transparent',
          // Use CSS transitions unless reduced motion is preferred
          !prefersReducedMotion && 'transition-all duration-200',
          isActive
            ? 'bg-slate-900/80 border-cyan-500/60 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]'
            : 'hover:bg-slate-900/60 hover:border-slate-700',
          // Emphasized sections get subtle highlight
          isEmphasized && !isActive && 'border-l-2 border-l-cyan-500/30'
        )
      }
    >
      <span
        className={cn(
          'relative flex items-center justify-center h-8 w-8 rounded-md bg-slate-900/80 flex-shrink-0',
          !prefersReducedMotion && 'group-hover:bg-slate-800 transition-colors'
        )}
      >
        <Icon className="h-4 w-4 text-slate-300" />
        {item.badge && (
          <span
            className={cn(
              'absolute -top-1 -right-1 rounded-full bg-cyan-500 text-[9px] px-1 py-[1px] text-slate-950 font-semibold',
              item.badge === 'New' && !prefersReducedMotion && 'animate-pulse'
            )}
          >
            {item.badge}
          </span>
        )}
      </span>
      {!isCollapsed && <span className="ml-3 flex-1 truncate text-slate-100">{item.label}</span>}
      {!isCollapsed && item.highlight && !item.badge && (
        <span className="ml-2 text-[10px] uppercase tracking-wide text-cyan-400">AI</span>
      )}
    </NavLink>
  );
}

export default Sidebar;

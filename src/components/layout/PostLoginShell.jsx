/**
 * PostLoginShell - Unified post-login layout
 *
 * Enterprise-grade shell with:
 * - Left: Vertical sidebar from navConfig
 * - Top: Slim header with workspace switcher, search, user menu
 * - Center: Main content area
 * - Context strip showing current section, plan, and environment
 */

import React, { useState, useMemo } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getFilteredSections, getEmphasizedSections, navSections } from '@/config/navConfig';
import { resolvePageChrome } from '@/config/pageChrome';
import { OperatorShell } from '@/components/layout/OperatorShell';
import { colors } from '@/theme/tokens';
import { useTenant } from '@/contexts/TenantContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavAnalytics } from '@/hooks/useNavAnalytics';
import { useReducedMotion } from '@/hooks/useMotion';
import {
  Sparkles,
  ChevronRight,
  Search,
  Command,
  Sun,
  Moon,
  User,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import CommandPalette from '../CommandPalette';
import WorkspaceSwitcher from './WorkspaceSwitcher';

/**
 * Micro-KPI for context strip
 */
const MicroKpi = ({ label, value, trend }) => (
  <div className="flex items-center gap-1.5 text-xs">
    <span style={{ color: colors.text.tertiary }}>{label}:</span>
    <span className="font-medium" style={{ color: colors.text.primary }}>
      {value}
    </span>
    {trend && (
      <span
        style={{
          color:
            trend === 'up'
              ? colors.semantic.success
              : trend === 'down'
                ? colors.semantic.danger
                : colors.text.tertiary,
        }}
      >
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'}
      </span>
    )}
  </div>
);

/**
 * Context strip showing current section and environment info
 */
const ContextStrip = ({ currentSection, currentItem }) => {
  const { plan, isAdmin, isDemo, tenant } = useTenant();

  const planBadge = useMemo(() => {
    switch (plan) {
      case 'enterprise':
        return { label: 'Enterprise', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'midmarket':
        return {
          label: 'Midmarket',
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        };
      default:
        return { label: 'Startup', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
    }
  }, [plan]);

  // Micro-KPIs based on current section
  const microKpis = useMemo(() => {
    if (!currentSection) return [];

    switch (currentSection.id) {
      case 'autonomous-gtm':
        return [
          { label: 'Active', value: '12', trend: 'up' },
          { label: 'Health', value: '99%', trend: 'stable' },
        ];
      case 'revenue-engine':
        return [
          { label: 'Pipeline', value: '$2.4M', trend: 'up' },
          { label: 'Leads', value: '847', trend: 'up' },
        ];
      case 'ai-operator':
        return [
          { label: 'AI Coverage', value: '78%', trend: 'up' },
          { label: 'Tasks', value: '156', trend: 'stable' },
        ];
      default:
        return [];
    }
  }, [currentSection]);

  return (
    <div
      className="h-9 border-b backdrop-blur-sm flex items-center px-4 gap-3"
      style={{ borderColor: colors.border.primary, backgroundColor: colors.bg.secondary }}
    >
      {/* Demo Org indicator */}
      {isDemo && (
        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: colors.text.tertiary }}>Demo:</span>
          <span className="font-medium" style={{ color: colors.text.primary }}>
            {tenant?.name || 'Demo Organization'}
          </span>
          <span style={{ color: colors.text.tertiary }}>—</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {currentSection && (
          <>
            <span style={{ color: colors.text.tertiary }}>{currentSection.label}</span>
            {currentItem && (
              <>
                <ChevronRight size={14} style={{ color: colors.text.secondary }} />
                <span className="font-medium" style={{ color: colors.text.primary }}>
                  {currentItem.label}
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* Micro-KPIs */}
      {microKpis.length > 0 && (
        <div
          className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l"
          style={{ borderColor: colors.border.primary }}
        >
          {microKpis.map((kpi, idx) => (
            <MicroKpi key={idx} {...kpi} />
          ))}
        </div>
      )}

      <div className="flex-1" />

      {/* Environment & Plan badges */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Dev
        </span>
        <span
          className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', planBadge.color)}
        >
          {planBadge.label}
        </span>
        {isAdmin && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            Admin
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Sidebar item component with badge support
 */
const SidebarItem = ({
  item,
  sectionId,
  isCollapsed,
  isEmphasized,
  onNavigate,
  prefersReducedMotion,
}) => {
  const Icon = item.icon;

  const badgeColors = {
    New: 'bg-emerald-500 text-white',
    Beta: 'bg-purple-500 text-white',
    AI: 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white',
    Pro: 'bg-amber-500 text-slate-900',
    Exec: 'bg-rose-500 text-white',
  };

  return (
    <NavLink
      to={item.path}
      onClick={() => onNavigate?.(item, sectionId)}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
          'border border-transparent',
          !prefersReducedMotion && 'transition-all duration-200',
          isActive
            ? 'bg-slate-900/80 border-cyan-500/60 text-white shadow-[0_0_12px_rgba(34,211,238,0.15)]'
            : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 hover:border-slate-700',
          isEmphasized && 'border-l-2 border-l-cyan-500/30'
        )
      }
    >
      <span
        className={cn(
          'flex items-center justify-center h-7 w-7 rounded-md bg-slate-900/80',
          !prefersReducedMotion && 'group-hover:bg-slate-800 transition-colors'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                badgeColors[item.badge] || 'bg-slate-700 text-slate-300'
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

/**
 * Main PostLoginShell component
 */
const PostLoginShell = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, plan, tenant, navigationLayout, isDemo } = useTenant();
  const { trackNavClick } = useNavAnalytics({ tenantId: tenant?.id, plan });
  const prefersReducedMotion = useReducedMotion();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Show top bar based on user preference
  const showTopBar = navigationLayout === 'sidebar-top';

  // Get filtered sections
  const sections = useMemo(() => getFilteredSections(isAdmin, plan), [isAdmin, plan]);
  const emphasizedSections = useMemo(() => getEmphasizedSections(plan), [plan]);

  // Find current section and item for context strip
  const { currentSection, currentItem } = useMemo(() => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) {
          return { currentSection: section, currentItem: item };
        }
      }
    }
    return { currentSection: null, currentItem: null };
  }, [location.pathname]);

  const pageChrome = useMemo(
    () => resolvePageChrome(location.pathname, currentItem?.label),
    [location.pathname, currentItem?.label]
  );

  const outletContent = children || <Outlet />;
  const content =
    pageChrome.mode === 'plain' ? (
      outletContent
    ) : (
      <OperatorShell scaffold={pageChrome.scaffold} className="min-h-full">
        {outletContent}
      </OperatorShell>
    );

  const handleNavClick = (item, sectionId) => {
    trackNavClick(item.id, sectionId, item.path);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}
    >
      {/* Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col backdrop-blur-xl',
          !prefersReducedMotion && 'transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
        style={{
          backgroundColor: colors.bg.secondary,
          borderColor: colors.border.primary,
        }}
      >
        {/* Brand Header */}
        <div
          className="h-14 px-4 flex items-center gap-3 border-b"
          style={{ borderColor: colors.border.primary }}
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="text-white" size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs uppercase tracking-wide text-slate-500">Artisan</span>
              <span className="text-sm font-semibold text-white truncate">
                {tenant?.name || 'Workspace'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
          {sections.map(section => {
            const isEmphasized = emphasizedSections.includes(section.id);
            return (
              <div key={section.id}>
                {!sidebarCollapsed && (
                  <div
                    className={cn(
                      'px-3 mb-2 text-[10px] font-medium uppercase tracking-[0.16em]',
                      isEmphasized ? 'text-cyan-400' : 'text-slate-600'
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
                      isCollapsed={sidebarCollapsed}
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

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-9 border-t flex items-center justify-center transition-colors"
          style={{
            borderColor: colors.border.primary,
            color: colors.text.secondary,
          }}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4',
              !prefersReducedMotion && 'transition-transform',
              sidebarCollapsed ? '' : 'rotate-180'
            )}
          />
        </button>
      </aside>

      {/* Main Area */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.bg.primary }}
      >
        {/* Header */}
        <header
          className="h-14 border-b backdrop-blur-xl flex items-center px-4 gap-3"
          style={{ borderColor: colors.border.primary, backgroundColor: colors.bg.secondary }}
        >
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ backgroundColor: colors.bg.surface, color: colors.text.secondary }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Workspace Switcher */}
          <div className="hidden md:block">
            <WorkspaceSwitcher />
          </div>

          <div className="flex-1" />

          {/* Search / Command Palette */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg transition-colors"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.bg.surface,
              borderColor: colors.border.secondary,
            }}
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search...</span>
            <kbd
              className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium border rounded"
              style={{
                backgroundColor: colors.bg.tertiary,
                borderColor: colors.border.secondary,
                color: colors.text.secondary,
              }}
            >
              <Command size={10} />K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg transition-colors relative"
            style={{ color: colors.text.secondary, backgroundColor: colors.bg.surface }}
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.secondary, backgroundColor: colors.bg.surface }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User */}
          <button className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </button>
        </header>

        {/* Optional Top Bar (section tabs) */}
        {showTopBar && (
          <div
            className="h-9 border-b backdrop-blur-sm flex items-center px-4 gap-1 overflow-x-auto"
            style={{ borderColor: colors.border.primary, backgroundColor: colors.bg.secondary }}
          >
            {sections.map(section => {
              const isActive = section.items.some(
                item =>
                  location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              );
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    // Navigate to first item in section
                    const firstItem = section.items[0];
                    if (firstItem) {
                      window.location.href = firstItem.path;
                    }
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border',
                    !prefersReducedMotion && 'transition-all'
                  )}
                  style={{
                    backgroundColor: isActive ? colors.bg.surface : colors.bg.primary,
                    color: isActive ? colors.text.primary : colors.text.secondary,
                    borderColor: colors.border.primary,
                  }}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Context Strip */}
        <ContextStrip currentSection={currentSection} currentItem={currentItem} />

        {/* Content */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: colors.bg.primary }}>
          {content}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Brand */}
            <div className="h-14 px-4 flex items-center gap-3 border-b border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="text-white" size={16} />
              </div>
              <span className="text-sm font-semibold text-white">Artisan</span>
            </div>

            {/* Mobile Nav */}
            <nav className="px-2 py-3 space-y-3">
              {sections.map(section => (
                <div key={section.id}>
                  <div className="px-3 mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                    {section.label}
                  </div>
                  <div className="space-y-1">
                    {section.items.map(item => (
                      <SidebarItem
                        key={item.id}
                        item={item}
                        sectionId={section.id}
                        isCollapsed={false}
                        isEmphasized={false}
                        onNavigate={handleNavClick}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
};

export default PostLoginShell;

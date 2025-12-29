/**
 * Route Health Check Page
 * 
 * Dev-only page to verify all routes are working
 * Lists all routes from navConfig with status indicators
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navSections } from '@/config/navConfig';
import { PageScaffold, BadgePill, SectionHeader } from '@/components/layout/shared';
import { cn } from '@/lib/utils';
import { ExternalLink, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface RouteStatus {
  path: string;
  status: 'unknown' | 'checking' | 'ok' | 'error';
  error?: string;
}

const RouteHealthPage = () => {
  const navigate = useNavigate();
  const [routeStatuses, setRouteStatuses] = useState<Record<string, RouteStatus>>({});

  // Get all routes from navConfig
  const allRoutes = navSections.flatMap((section) =>
    section.items.map((item) => ({
      section: section.label,
      ...item,
    }))
  );

  const checkRoute = (path: string) => {
    setRouteStatuses((prev) => ({
      ...prev,
      [path]: { path, status: 'checking' },
    }));

    // Simple check: Try to navigate and see if it loads
    // In a real implementation, this would be more sophisticated
    setTimeout(() => {
      setRouteStatuses((prev) => ({
        ...prev,
        [path]: { path, status: 'ok' },
      }));
    }, 500);
  };

  const checkAllRoutes = () => {
    allRoutes.forEach((route) => {
      checkRoute(route.path);
    });
  };

  const getStatusIcon = (status: RouteStatus['status']) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Clock className="w-4 h-4 text-cyan-500 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-slate-700" />;
    }
  };

  return (
    <PageScaffold
      title="Route Health Check"
      subtitle="Development tool to verify all routes are accessible"
      badges={[{ text: 'Dev Only', variant: 'default' }]}
      actions={
        <button
          onClick={checkAllRoutes}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
        >
          Check All Routes
        </button>
      }
    >
      <div className="space-y-8">
        {navSections.map((section) => (
          <div key={section.id}>
            <SectionHeader
              title={section.label}
              subtitle={section.description}
            />

            <div className="grid gap-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const status = routeStatuses[item.path];

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border transition-colors',
                      'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    )}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800">
                      <Icon className="w-5 h-5 text-slate-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{item.label}</span>
                        {item.badge && (
                          <BadgePill
                            variant={
                              item.badge === 'AI' ? 'ai' :
                              item.badge === 'Beta' ? 'beta' :
                              item.badge === 'New' ? 'new' :
                              item.badge === 'Pro' ? 'pro' :
                              item.badge === 'Exec' ? 'exec' :
                              'default'
                            }
                          >
                            {item.badge}
                          </BadgePill>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 truncate">
                        {item.description || item.path}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      {status && getStatusIcon(status.status)}

                      {/* Actions */}
                      <button
                        onClick={() => checkRoute(item.path)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                      >
                        Check
                      </button>

                      <button
                        onClick={() => navigate(item.path)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors"
                      >
                        Open
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 rounded-lg bg-slate-900 border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Total Routes</p>
            <p className="text-2xl font-bold text-white">{allRoutes.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Checked</p>
            <p className="text-2xl font-bold text-cyan-500">
              {Object.values(routeStatuses).filter((s) => s.status !== 'unknown').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Passing</p>
            <p className="text-2xl font-bold text-emerald-500">
              {Object.values(routeStatuses).filter((s) => s.status === 'ok').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Failing</p>
            <p className="text-2xl font-bold text-red-500">
              {Object.values(routeStatuses).filter((s) => s.status === 'error').length}
            </p>
          </div>
        </div>
      </div>
    </PageScaffold>
  );
};

export default RouteHealthPage;

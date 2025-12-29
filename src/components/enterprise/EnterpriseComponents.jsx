/**
 * Enterprise Admin Components
 * 
 * Shared UI components for enterprise admin surfaces:
 * - AccessMatrix: Role/permission matrix with toggles
 * - RoleDetailDrawer: Slide-out panel for role details
 * - SecurityStatusCard: SSO/MFA/SCIM status
 * - UsageBar: Horizontal usage bar with thresholds
 * - SystemHealthCard: Service status chips
 * - FeatureFlagRow: Flag with controls
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  Lock, 
  Key, 
  Check, 
  X, 
  ChevronRight,
  AlertTriangle,
  Info,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  BookOpen,
  Target,
  BarChart3,
  Globe,
  Server,
  Database,
  Mail,
  Webhook,
  AlertCircle,
  CheckCircle,
  XCircle,
  MinusCircle,
  Percent,
  Power,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText } from '../futuristic';
import { useReducedMotion } from '../../hooks/useMotion';

// ============================================================================
// ACCESS MATRIX
// ============================================================================

export const AccessMatrix = ({ 
  roles, 
  scopes, 
  capabilities, 
  getPermissionMatrix,
  onPermissionChange,
  readOnly = false 
}) => {
  const [selectedRole, setSelectedRole] = useState(roles[0]?.id);
  const prefersReducedMotion = useReducedMotion();
  
  const matrix = useMemo(() => 
    getPermissionMatrix(selectedRole), 
    [selectedRole, getPermissionMatrix]
  );

  const iconMap = {
    playbooks: BookOpen,
    campaigns: Target,
    leads: Users,
    analytics: BarChart3,
    settings: Settings,
    admin: Shield,
  };

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <div className="flex flex-wrap gap-2">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedRole === role.id
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
            }`}
          >
            <span 
              className="w-2 h-2 rounded-full inline-block mr-2" 
              style={{ backgroundColor: role.color }}
            />
            {role.name}
          </button>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">
                Resource
              </th>
              {capabilities.map(cap => (
                <th key={cap} className="text-center py-3 px-3 text-sm font-semibold text-slate-300 capitalize">
                  {cap}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scopes.map(scope => {
              const Icon = iconMap[scope.id] || Shield;
              return (
                <tr key={scope.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-white">{scope.name}</span>
                    </div>
                  </td>
                  {capabilities.map(cap => {
                    const hasPermission = matrix[scope.id]?.[cap] || false;
                    return (
                      <td key={cap} className="text-center py-3 px-3">
                        <button
                          disabled={readOnly}
                          onClick={() => onPermissionChange?.(selectedRole, scope.id, cap, !hasPermission)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            hasPermission
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                          } ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {hasPermission ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Role Description */}
      {selectedRole && (
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: roles.find(r => r.id === selectedRole)?.color }}
            />
            <span className="font-semibold text-white">
              {roles.find(r => r.id === selectedRole)?.name}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {roles.find(r => r.id === selectedRole)?.description}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SECURITY STATUS CARD
// ============================================================================

export const SecurityStatusCard = ({ status, securityScore, compact = false }) => {
  const items = [
    { 
      key: 'sso', 
      label: 'SSO', 
      enabled: status?.sso?.enabled,
      detail: status?.sso?.provider || 'Not configured',
      icon: Key,
    },
    { 
      key: 'mfa', 
      label: 'MFA', 
      enabled: status?.mfa?.enabled,
      detail: status?.mfa?.enabled ? `${status.mfa.adoptionPercent}% adoption` : 'Disabled',
      icon: Shield,
    },
    { 
      key: 'scim', 
      label: 'SCIM', 
      enabled: status?.scim?.enabled,
      detail: status?.scim?.enabled ? 'Active' : 'Not configured',
      icon: Users,
    },
    { 
      key: 'residency', 
      label: 'Data Residency', 
      enabled: status?.dataResidency?.compliant,
      detail: status?.dataResidency?.region || 'Not set',
      icon: Globe,
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {items.map(item => (
          <div 
            key={item.key}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
              item.enabled 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            <item.icon className="h-3 w-3" />
            {item.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <GlassCard variant="gradient">
      <GlassCardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Security Status</h3>
              <p className="text-sm text-slate-400">Identity & access posture</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{securityScore}%</div>
            <div className="text-xs text-slate-400">Security Score</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {items.map(item => (
            <div 
              key={item.key}
              className={`p-3 rounded-lg border ${
                item.enabled 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{item.label}</span>
                {item.enabled ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-slate-500" />
                )}
              </div>
              <p className="text-xs text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};

// ============================================================================
// USAGE BAR
// ============================================================================

export const UsageBar = ({ 
  label, 
  used, 
  limit, 
  trend = [], 
  unit = '',
  showTrend = true 
}) => {
  const percent = Math.round((used / limit) * 100);
  const isWarning = percent >= 80;
  const isCritical = percent >= 95;

  const barColor = isCritical 
    ? 'bg-red-500' 
    : isWarning 
      ? 'bg-amber-500' 
      : 'bg-cyan-500';

  const formatNumber = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {formatNumber(used)}{unit} / {formatNumber(limit)}{unit}
          </span>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
            isCritical ? 'bg-red-500/20 text-red-400' :
            isWarning ? 'bg-amber-500/20 text-amber-400' :
            'bg-slate-700 text-slate-300'
          }`}>
            {percent}%
          </span>
        </div>
      </div>
      
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>

      {showTrend && trend.length > 0 && (
        <div className="flex items-center gap-1 h-4">
          {trend.map((val, i) => (
            <div 
              key={i}
              className="flex-1 bg-slate-700 rounded-sm overflow-hidden"
              style={{ height: '100%' }}
            >
              <div 
                className={`w-full ${barColor} opacity-50`}
                style={{ height: `${val}%` }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SYSTEM HEALTH CARD
// ============================================================================

export const SystemHealthCard = ({ services, overallHealth }) => {
  const statusColors = {
    healthy: { bg: 'bg-green-500/10', text: 'text-green-400', icon: CheckCircle },
    degraded: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: AlertCircle },
    unhealthy: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
  };

  const iconMap = {
    api: Server,
    ai: Zap,
    email: Mail,
    crm: Database,
    webhooks: Webhook,
  };

  return (
    <GlassCard variant="gradient">
      <GlassCardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${statusColors[overallHealth]?.bg}`}>
              <Activity className={`h-6 w-6 ${statusColors[overallHealth]?.text}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">System Health</h3>
              <p className="text-sm text-slate-400">Service status overview</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${statusColors[overallHealth]?.text} border-current`}
          >
            {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
          </Badge>
        </div>

        <div className="space-y-3">
          {services.map(service => {
            const Icon = iconMap[service.id] || Server;
            const StatusIcon = statusColors[service.status]?.icon || MinusCircle;
            
            return (
              <div 
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-white">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">{service.latencyMs}ms</span>
                  <span className="text-xs text-slate-400">{service.errorRate}% err</span>
                  <StatusIcon className={`h-4 w-4 ${statusColors[service.status]?.text}`} />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};

// ============================================================================
// FEATURE FLAG ROW
// ============================================================================

export const FeatureFlagRow = ({ 
  flag, 
  onToggle, 
  onKillSwitch, 
  onRolloutChange,
  environment = 'production'
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const isActive = flag.enabled && 
    flag.environment?.[environment] !== false &&
    flag.rolloutPercent > 0;

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(flag.key, !flag.enabled);
            }}
            className={`p-1 rounded transition-colors ${
              isActive ? 'text-green-400' : 'text-slate-500'
            }`}
          >
            {isActive ? (
              <ToggleRight className="h-6 w-6" />
            ) : (
              <ToggleLeft className="h-6 w-6" />
            )}
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{flag.name}</span>
              {flag.isKillSwitch && (
                <Badge variant="outline" className="text-red-400 border-red-400/50 text-xs">
                  Kill Switch
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-400">{flag.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-white">{flag.rolloutPercent}%</div>
            <div className="text-xs text-slate-400">rollout</div>
          </div>
          <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-slate-700 bg-slate-800/30 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Owner</label>
                  <span className="text-sm text-white">{flag.owner}</span>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Key</label>
                  <code className="text-sm text-cyan-400 bg-slate-900 px-2 py-0.5 rounded">{flag.key}</code>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Environment</label>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      flag.environment?.production ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                    }`}>Prod</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      flag.environment?.sandbox ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
                    }`}>Sandbox</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-2">Rollout Percentage</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={flag.rolloutPercent}
                    onChange={(e) => onRolloutChange?.(flag.key, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-sm text-white w-12 text-right">{flag.rolloutPercent}%</span>
                </div>
              </div>

              {flag.isKillSwitch && (
                <Button
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => onKillSwitch?.(flag.key)}
                >
                  <Power className="h-4 w-4 mr-2" />
                  Activate Kill Switch
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// ENTERPRISE READINESS METER
// ============================================================================

export const EnterpriseReadinessMeter = ({ categories, overallScore }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </div>
        <p className="text-slate-400 mt-1">Enterprise Readiness Score</p>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{cat.name}</span>
              <span className={`text-sm font-semibold ${getScoreColor(cat.score)}`}>
                {cat.score}%
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${cat.score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${getBarColor(cat.score)}`}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map(item => (
                <a
                  key={item.key}
                  href={item.link}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    item.done 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {item.done ? <Check className="h-3 w-3 inline mr-1" /> : null}
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// AUDIT LOG TABLE
// ============================================================================

export const AuditLogTable = ({ 
  logs = [], 
  onExport,
  onInspect,
  loading = false 
}) => {
  const getResultColor = (result) => {
    if (result === 'success') return 'text-green-400 bg-green-500/10';
    if (result === 'failure') return 'text-red-400 bg-red-500/10';
    return 'text-slate-400 bg-slate-700';
  };

  const getActionColor = (action) => {
    if (action.includes('delete')) return 'text-red-400';
    if (action.includes('create')) return 'text-green-400';
    if (action.includes('update')) return 'text-amber-400';
    return 'text-cyan-400';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Time</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Actor</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Action</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Resource</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Result</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Location</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log.id || i} className="border-b border-slate-800 hover:bg-slate-800/50">
              <td className="py-3 px-4 text-sm text-slate-300">{log.time}</td>
              <td className="py-3 px-4">
                <div className="text-sm text-white">{log.actor}</div>
                <div className="text-xs text-slate-500">{log.actorEmail}</div>
              </td>
              <td className={`py-3 px-4 text-sm font-medium ${getActionColor(log.action)}`}>
                {log.action}
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-white">{log.resourceType}</div>
                <div className="text-xs text-slate-500">{log.resourceId}</div>
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full ${getResultColor(log.result)}`}>
                  {log.result}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-slate-300">{log.ip}</div>
                <div className="text-xs text-slate-500">{log.location}</div>
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => onInspect?.(log)}
                  className="text-cyan-400 hover:text-cyan-300 p-1"
                  title="Inspect in context"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// AI DECISION CARD
// ============================================================================

export const AIDecisionCard = ({ decision }) => {
  const riskColors = {
    low: 'bg-green-500/10 text-green-400 border-green-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    high: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <div className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="font-medium text-white">{decision.action}</h4>
            <p className="text-xs text-slate-400">{decision.timestamp}</p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={riskColors[decision.risk]}
        >
          {decision.risk} risk
        </Badge>
      </div>
      
      <p className="text-sm text-slate-300 mb-3">{decision.explanation}</p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Model: <span className="text-slate-300">{decision.model}</span>
        </span>
        <span className="text-slate-400">
          Confidence: <span className="text-cyan-400">{decision.confidence}%</span>
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// WORKSPACE SWITCHER
// ============================================================================

export const WorkspaceSwitcher = ({ 
  workspaces, 
  activeWorkspace, 
  onSwitch,
  compact = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const productionWs = workspaces.filter(w => w.environment === 'production');
  const sandboxWs = workspaces.filter(w => w.environment === 'sandbox');

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <Globe className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-white">{activeWorkspace?.name}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            activeWorkspace?.environment === 'sandbox' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-green-500/20 text-green-400'
          }`}>
            {activeWorkspace?.environment}
          </span>
          <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
            >
              <div className="p-2">
                <div className="text-xs text-slate-500 uppercase px-2 py-1">Production</div>
                {productionWs.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => { onSwitch(ws.id); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                      ws.isActive 
                        ? 'bg-cyan-500/10 text-cyan-400' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="flex-1">{ws.name}</span>
                    <span className="text-xs text-slate-500">{ws.region}</span>
                  </button>
                ))}
                
                <div className="text-xs text-slate-500 uppercase px-2 py-1 mt-2">Sandbox</div>
                {sandboxWs.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => { onSwitch(ws.id); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                      ws.isActive 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="flex-1">{ws.name}</span>
                    <span className="text-xs text-slate-500">{ws.region}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null; // Full version would be a page component
};

export default {
  AccessMatrix,
  SecurityStatusCard,
  UsageBar,
  SystemHealthCard,
  FeatureFlagRow,
  EnterpriseReadinessMeter,
  AuditLogTable,
  AIDecisionCard,
  WorkspaceSwitcher,
};

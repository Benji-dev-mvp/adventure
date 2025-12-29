/**
 * Observability Console
 *
 * Enterprise admin page for system health monitoring:
 * - System Health: API latency, error rates, uptime
 * - AI Infrastructure: Model latency, fallback rates
 * - Dependencies: CRM, email provider, webhooks status
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { SystemHealthCard, UsageBar } from '../components/enterprise';
import { useSystemStatus } from '../hooks/useEnterprise';
import { useReducedMotion } from '../hooks/useMotion';
import {
  Activity,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Download,
} from 'lucide-react';
import { GlassCard, GlassCardContent, GradientText } from '../components/futuristic';
import { AreaChart } from 'recharts/es6/chart/AreaChart.js';
import { Area } from 'recharts/es6/cartesian/Area.js';
import { XAxis } from 'recharts/es6/cartesian/XAxis.js';
import { YAxis } from 'recharts/es6/cartesian/YAxis.js';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid.js';
import { Tooltip } from 'recharts/es6/component/Tooltip.js';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer.js';
import { LineChart } from 'recharts/es6/chart/LineChart.js';
import { Line } from 'recharts/es6/cartesian/Line.js';

const AdminObservability = () => {
  const { status, serviceList, overallHealth, isMaintenanceMode } = useSystemStatus();
  const prefersReducedMotion = useReducedMotion();
  const [refreshing, setRefreshing] = useState(false);

  // Mock time series data
  const latencyData = [
    { time: '00:00', api: 42, ai: 310, email: 145 },
    { time: '04:00', api: 38, ai: 290, email: 138 },
    { time: '08:00', api: 55, ai: 380, email: 165 },
    { time: '12:00', api: 48, ai: 340, email: 152 },
    { time: '16:00', api: 52, ai: 360, email: 158 },
    { time: '20:00', api: 45, ai: 320, email: 148 },
    { time: 'Now', api: 45, ai: 320, email: 150 },
  ];

  const errorRateData = [
    { time: '00:00', rate: 0.02 },
    { time: '04:00', rate: 0.01 },
    { time: '08:00', rate: 0.05 },
    { time: '12:00', rate: 0.03 },
    { time: '16:00', rate: 0.08 },
    { time: '20:00', rate: 0.04 },
    { time: 'Now', rate: 0.02 },
  ];

  // SLO metrics
  const sloMetrics = [
    { name: 'API Uptime', target: 99.9, actual: 99.95, unit: '%' },
    { name: 'API Latency P95', target: 100, actual: 85, unit: 'ms', inverse: true },
    { name: 'AI Response Time', target: 500, actual: 320, unit: 'ms', inverse: true },
    { name: 'Email Delivery', target: 99.5, actual: 99.2, unit: '%' },
    { name: 'Webhook Success', target: 99.0, actual: 99.8, unit: '%' },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const getSLOStatus = metric => {
    if (metric.inverse) {
      return metric.actual <= metric.target;
    }
    return metric.actual >= metric.target;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3"
        >
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-3">
              <Activity className="h-7 w-7 text-cyan-400" />
              <GradientText gradient="cyber">Observability Console</GradientText>
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor system health, performance, and reliability metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Maintenance Mode Warning */}
        {isMaintenanceMode && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3"
          >
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <div>
              <h4 className="font-semibold text-amber-400">Maintenance Mode Active</h4>
              <p className="text-sm text-slate-300">
                Read-only mode is in effect. No changes allowed.
              </p>
            </div>
          </motion.div>
        )}

        {/* Overall Status */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SystemHealthCard services={serviceList} overallHealth={overallHealth} />
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-3"
        >
          {/* Latency Chart */}
          <GlassCard variant="gradient">
            <GlassCardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Service Latency (ms)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="api"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={false}
                      name="API"
                    />
                    <Line
                      type="monotone"
                      dataKey="ai"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="AI"
                    />
                    <Line
                      type="monotone"
                      dataKey="email"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={false}
                      name="Email"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-sm text-slate-400">API</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm text-slate-400">AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-slate-400">Email</span>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Error Rate Chart */}
          <GlassCard variant="gradient">
            <GlassCardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Error Rate (%)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={errorRateData}>
                    <defs>
                      <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      formatter={value => [`${value}%`, 'Error Rate']}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#errorGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* SLO Compliance */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard variant="gradient">
            <GlassCardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-6">SLO Compliance</h3>
              <div className="grid md:grid-cols-5 gap-3">
                {sloMetrics.map((metric, i) => {
                  const passing = getSLOStatus(metric);
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        passing
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">{metric.name}</span>
                        {passing ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div className="text-lg font-bold text-white">
                        {metric.actual}
                        {metric.unit}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Target: {metric.inverse ? '≤' : '≥'} {metric.target}
                        {metric.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* AI Infrastructure */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard variant="gradient">
            <GlassCardContent className="p-4">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                AI Infrastructure
              </h3>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="space-y-3">
                  <UsageBar
                    label="Model Latency (P95)"
                    used={320}
                    limit={500}
                    unit="ms"
                    showTrend={false}
                  />
                </div>
                <div className="space-y-3">
                  <UsageBar label="Token Usage" used={847000} limit={1000000} showTrend={false} />
                </div>
                <div className="space-y-3">
                  <UsageBar label="Fallback Rate" used={2} limit={100} unit="%" showTrend={false} />
                </div>
                <div className="space-y-3">
                  <UsageBar
                    label="Cache Hit Rate"
                    used={78}
                    limit={100}
                    unit="%"
                    showTrend={false}
                  />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminObservability;

import React, { Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Brain,
  Gauge,
  RefreshCw,
  Sparkles
} from 'lucide-react';

/**
 * Autopilot Page
 * Main dashboard for the autonomous revenue engine
 */

const AutopilotDashboard = lazy(() => import('@/modules/autonomy/AutopilotDashboard').then(m => ({ default: m.AutopilotDashboard })));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-950">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className="w-8 h-8 text-violet-500" />
    </motion.div>
  </div>
);

/**
 * System Status Card for the hero section
 */
const StatusCard = ({ icon: Icon, label, value, trend, status }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'success' | 'warning' | 'error';
}) => {
  const statusColor = status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : status === 'error' ? 'text-red-400' : 'text-slate-400';
  const bgColor = status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : status === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : status === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/50 border-slate-700';
  
  return (
    <div className={`px-4 py-3 rounded-lg border ${bgColor} flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800/50 ${statusColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">{value}</span>
          {trend && (
            <span className={trend === 'up' ? 'text-emerald-400 text-sm' : trend === 'down' ? 'text-red-400 text-sm' : 'text-slate-500 text-sm'}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Mini funnel chart
 */
const MiniFunnel = () => {
  const stages = [
    { label: 'Leads', value: 2847, width: '100%' },
    { label: 'MQLs', value: 892, width: '60%' },
    { label: 'SQLs', value: 234, width: '32%' },
    { label: 'Closed', value: 47, width: '12%' },
  ];
  
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5" />
        Funnel Health
      </div>
      <div className="space-y-2">
        {stages.map((stage, idx) => (
          <div key={stage.label} className="flex items-center gap-2">
            <div className="w-12 text-xs text-slate-500">{stage.label}</div>
            <div className="flex-1 h-4 bg-slate-900 rounded overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: stage.width }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded"
              />
            </div>
            <div className="w-14 text-xs text-white text-right">{stage.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Activity ticker showing recent AI actions
 */
const ActivityTicker = () => {
  const activities = useMemo(() => [
    { icon: Brain, text: 'AI adjusted send timing for enterprise segment', time: '2m ago', type: 'ai' },
    { icon: Zap, text: 'New A/B test launched: Subject line variant', time: '8m ago', type: 'experiment' },
    { icon: RefreshCw, text: 'Model retrained with latest conversion data', time: '15m ago', type: 'model' },
    { icon: Gauge, text: 'Pacing increased to meet Q1 targets', time: '23m ago', type: 'pacing' },
  ], []);
  
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5" />
        System Activity
      </div>
      <div className="space-y-2">
        {activities.map((activity, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-2 text-xs"
          >
            <activity.icon className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
            <span className="text-slate-300 flex-1">{activity.text}</span>
            <span className="text-slate-600">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AutopilotPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="h-screen overflow-auto bg-slate-950">
        {/* Hero Status Strip */}
        <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-violet-950/20 to-slate-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                Autonomous Engine
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </h1>
              <p className="text-sm text-slate-500">AI-driven GTM operations • Real-time optimization</p>
            </div>
          </div>
          
          {/* Status Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatusCard icon={Zap} label="Active Playbooks" value={12} trend="stable" status="success" />
            <StatusCard icon={Brain} label="AI Decisions (24h)" value={47} trend="up" status="success" />
            <StatusCard icon={CheckCircle2} label="System Health" value="99.2%" status="success" />
            <StatusCard icon={AlertTriangle} label="Pending Reviews" value={3} status="warning" />
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <MiniFunnel />
            <ActivityTicker />
          </div>
        </div>
        
        {/* Main Dashboard */}
        <div className="p-6">
          <AutopilotDashboard />
        </div>
      </div>
    </Suspense>
  );
};

export default AutopilotPage;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gauge,
  Power,
  Settings2,
  Eye,
  XCircle,
  Clock,
  ArrowUpRight,
  Brain,
  Zap,
  RefreshCw,
  Hand,
  Pause,
} from 'lucide-react';

/**
 * Autopilot Dashboard Component
 * Live state of system decisions + interventions allowed
 */

const AutopilotDashboard = () => {
  const [autopilotMode, setAutopilotMode] = useState('supervised');
  const [isActive, setIsActive] = useState(true);
  const [recentDecisions, _setRecentDecisions] = useState([
    {
      id: 'd1',
      type: 'experiment_launch',
      description: 'Launched A/B test: Subject line personalization',
      reasoning: 'Open rates below baseline. Testing personalization approach.',
      impact: '+12% expected open rate',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      wasOverridden: false,
    },
    {
      id: 'd2',
      type: 'pacing_adjustment',
      description: 'Increased daily send volume by 15%',
      reasoning: 'Pipeline commitment at risk. Accelerating to meet Q1 target.',
      impact: '23 additional sends/day',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      wasOverridden: false,
    },
    {
      id: 'd3',
      type: 'strategy_change',
      description: 'Shifted focus to enterprise segment',
      reasoning: 'Higher conversion rates detected in enterprise ICP.',
      impact: 'Reallocated 30% of leads',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      wasOverridden: true,
      overrideReason: 'Manual override: maintaining midmarket focus for Q1',
    },
  ]);

  const [interventions, _setInterventions] = useState([
    { id: 'i1', type: 'pause', target: 'strategy', targetId: 'strat-1', label: 'Pause Enterprise Campaign', severity: 'safe' },
    { id: 'i2', type: 'adjust', target: 'pacing', targetId: 'pace-1', label: 'Reduce Send Volume', severity: 'safe' },
    { id: 'i3', type: 'override', target: 'experiment', targetId: 'exp-1', label: 'End Experiment Early', severity: 'caution' },
    { id: 'i4', type: 'rollback', target: 'model', targetId: 'model-1', label: 'Rollback Model Update', severity: 'risky' },
  ]);

  const modes = [
    { id: 'full_auto', label: 'Full Auto', description: 'System operates independently', icon: Zap },
    { id: 'supervised', label: 'Supervised', description: 'AI suggests, human approves', icon: Eye },
    { id: 'suggestion_only', label: 'Suggestions', description: 'AI only provides recommendations', icon: Brain },
    { id: 'manual', label: 'Manual', description: 'Full human control', icon: Hand },
  ];

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'strategy_change': return Brain;
      case 'experiment_launch': return Zap;
      case 'pacing_adjustment': return Gauge;
      case 'model_update': return RefreshCw;
      default: return ArrowUpRight;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'safe': return 'text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20';
      case 'caution': return 'text-amber-400 bg-amber-400/10 border-amber-400/20 hover:bg-amber-400/20';
      case 'risky': return 'text-red-400 bg-red-400/10 border-red-400/20 hover:bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header with Power Toggle */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isActive 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gray-700'
            }`}>
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Autopilot Control</h2>
              <p className="text-sm text-gray-400">
                {isActive ? 'System is actively managing campaigns' : 'Autopilot is disabled'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings2 className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                isActive
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              }`}
            >
              <Power className="w-4 h-4" />
              {isActive ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setAutopilotMode(mode.id)}
              disabled={!isActive}
              className={`p-3 rounded-lg border transition-all ${
                autopilotMode === mode.id && isActive
                  ? 'bg-violet-500/10 border-violet-500/50 text-violet-400'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
              } ${!isActive && 'opacity-50 cursor-not-allowed'}`}
            >
              <mode.icon className="w-5 h-5 mx-auto mb-2" />
              <div className="text-sm font-medium">{mode.label}</div>
              <div className="text-xs text-gray-500 mt-1">{mode.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
        {/* Recent Decisions */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Recent Decisions
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {recentDecisions.map((decision, idx) => {
                const DecisionIcon = getDecisionIcon(decision.type);
                return (
                  <motion.div
                    key={decision.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      decision.wasOverridden
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-gray-800/50 border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        decision.wasOverridden ? 'bg-amber-500/10' : 'bg-violet-500/10'
                      }`}>
                        <DecisionIcon className={`w-4 h-4 ${
                          decision.wasOverridden ? 'text-amber-400' : 'text-violet-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{decision.description}</span>
                          {decision.wasOverridden && (
                            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded">
                              Overridden
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{decision.reasoning}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-400">{decision.impact}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(decision.timestamp)}
                          </span>
                        </div>
                        {decision.overrideReason && (
                          <div className="mt-2 p-2 bg-amber-500/10 rounded text-xs text-amber-300">
                            {decision.overrideReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Interventions */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Available Interventions
          </h3>
          <div className="space-y-3">
            {interventions.map((intervention) => (
              <motion.button
                key={intervention.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg border transition-all text-left ${getSeverityColor(intervention.severity)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {intervention.type === 'pause' && <Pause className="w-4 h-4" />}
                    {intervention.type === 'adjust' && <Settings2 className="w-4 h-4" />}
                    {intervention.type === 'override' && <XCircle className="w-4 h-4" />}
                    {intervention.type === 'rollback' && <RefreshCw className="w-4 h-4" />}
                    <span className="font-medium text-sm">{intervention.label}</span>
                  </div>
                  <span className="text-xs opacity-70 capitalize">{intervention.severity}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Health Score */}
          <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3">System Health</h4>
            <div className="space-y-3">
              {[
                { label: 'Strategy Alignment', value: 92, status: 'good' },
                { label: 'Model Performance', value: 87, status: 'good' },
                { label: 'Experiment Coverage', value: 78, status: 'moderate' },
                { label: 'Pipeline Pacing', value: 65, status: 'warning' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">{metric.label}</span>
                    <span className={`text-sm font-medium ${
                      metric.status === 'good' ? 'text-green-400' :
                      metric.status === 'moderate' ? 'text-amber-400' :
                      'text-red-400'
                    }`}>{metric.value}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'moderate' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AutopilotDashboard };
export default AutopilotDashboard;

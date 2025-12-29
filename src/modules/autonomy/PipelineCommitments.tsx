import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Zap,
  BarChart3,
  DollarSign,
  Plus,
} from 'lucide-react';

/**
 * Pipeline Commitments Component
 * Forecast-driven execution with automatic pacing
 */

const PipelineCommitments = () => {
  const [commitments, _setCommitments] = useState([
    {
      id: 'commit-1',
      name: 'Q1 Enterprise SaaS',
      targetMeetings: 300,
      currentMeetings: 142,
      targetPipeline: 2500000,
      currentPipeline: 1180000,
      timeframe: 'quarterly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      segment: 'Enterprise',
      status: 'at_risk',
      burnRate: 4.2,
      projectedCompletion: new Date('2024-04-15'),
      daysRemaining: 62,
      pacingStatus: 'behind',
    },
    {
      id: 'commit-2',
      name: 'Midmarket Finance',
      targetMeetings: 150,
      currentMeetings: 98,
      targetPipeline: 750000,
      currentPipeline: 520000,
      timeframe: 'quarterly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      segment: 'Midmarket',
      status: 'on_track',
      burnRate: 2.1,
      projectedCompletion: new Date('2024-03-25'),
      daysRemaining: 62,
      pacingStatus: 'on_track',
    },
    {
      id: 'commit-3',
      name: 'SMB Tech Expansion',
      targetMeetings: 500,
      currentMeetings: 387,
      targetPipeline: 500000,
      currentPipeline: 412000,
      timeframe: 'quarterly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      segment: 'SMB',
      status: 'ahead',
      burnRate: 8.5,
      projectedCompletion: new Date('2024-03-10'),
      daysRemaining: 62,
      pacingStatus: 'ahead',
    },
  ]);

  const [selectedCommitment, setSelectedCommitment] = useState(commitments[0]);

  const adjustments = [
    {
      type: 'increase_volume',
      description: 'Increase daily send volume by 25%',
      impact: 18,
      effort: 'low',
      autoApplicable: true,
    },
    {
      type: 'expand_icp',
      description: 'Expand ICP to adjacent industries',
      impact: 15,
      effort: 'medium',
      autoApplicable: true,
    },
    {
      type: 'add_channel',
      description: 'Add LinkedIn voice messaging',
      impact: 12,
      effort: 'medium',
      autoApplicable: false,
    },
    {
      type: 'improve_conversion',
      description: 'Optimize follow-up sequence',
      impact: 8,
      effort: 'high',
      autoApplicable: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return 'text-green-400 bg-green-400/10';
      case 'on_track':
        return 'text-blue-400 bg-blue-400/10';
      case 'at_risk':
        return 'text-amber-400 bg-amber-400/10';
      case 'behind':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPacingIcon = (status: string) => {
    switch (status) {
      case 'ahead':
        return TrendingUp;
      case 'on_track':
        return ArrowRight;
      case 'behind':
        return TrendingDown;
      default:
        return ArrowRight;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Pipeline Commitments</h2>
              <p className="text-sm text-gray-400">Forecast-driven execution with auto-pacing</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Commitment
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {[
            {
              label: 'Total Target',
              value: formatCurrency(3750000),
              subValue: '950 meetings',
              icon: Target,
              color: 'text-violet-400',
            },
            {
              label: 'Current Pipeline',
              value: formatCurrency(2112000),
              subValue: '627 meetings',
              icon: DollarSign,
              color: 'text-green-400',
            },
            {
              label: 'Avg Burn Rate',
              value: '4.9/day',
              subValue: 'meetings',
              icon: Zap,
              color: 'text-amber-400',
            },
            {
              label: 'Days Remaining',
              value: '62',
              subValue: 'Q1 2024',
              icon: Calendar,
              color: 'text-blue-400',
            },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.subValue}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
        {/* Commitments List */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Active Commitments
          </h3>
          <div className="space-y-3">
            {commitments.map(commitment => {
              const PacingIcon = getPacingIcon(commitment.pacingStatus);
              const progress = (commitment.currentMeetings / commitment.targetMeetings) * 100;

              return (
                <motion.button
                  key={commitment.id}
                  onClick={() => setSelectedCommitment(commitment)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedCommitment?.id === commitment.id
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-white text-sm">{commitment.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commitment.status)}`}
                    >
                      {commitment.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>
                        {commitment.currentMeetings} / {commitment.targetMeetings} meetings
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          commitment.status === 'ahead'
                            ? 'bg-green-500'
                            : commitment.status === 'on_track'
                              ? 'bg-blue-500'
                              : commitment.status === 'at_risk'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                      <DollarSign className="w-3 h-3" />
                      {formatCurrency(commitment.currentPipeline)}
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        commitment.pacingStatus === 'ahead'
                          ? 'text-green-400'
                          : commitment.pacingStatus === 'on_track'
                            ? 'text-blue-400'
                            : 'text-amber-400'
                      }`}
                    >
                      <PacingIcon className="w-3 h-3" />
                      {commitment.burnRate}/day
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Burn-Down Chart */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Burn-Down Analysis
          </h3>
          {selectedCommitment && (
            <div className="space-y-3">
              {/* Chart Placeholder */}
              <div className="bg-gray-800/50 rounded-lg p-4 h-48 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Burn-down visualization</p>
                  <p className="text-xs text-gray-600">Target vs Actual trajectory</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <span className="text-xs text-gray-400">Projected Completion</span>
                  <div className="text-lg font-semibold text-white">
                    {selectedCommitment.projectedCompletion.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <span
                    className={`text-xs ${
                      selectedCommitment.projectedCompletion <= selectedCommitment.endDate
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {selectedCommitment.projectedCompletion <= selectedCommitment.endDate
                      ? 'On target'
                      : 'Behind schedule'}
                  </span>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <span className="text-xs text-gray-400">Required Rate</span>
                  <div className="text-lg font-semibold text-white">
                    {Math.ceil(
                      ((selectedCommitment.targetMeetings - selectedCommitment.currentMeetings) /
                        selectedCommitment.daysRemaining) *
                        10
                    ) / 10}
                    /day
                  </div>
                  <span
                    className={`text-xs ${
                      selectedCommitment.burnRate >=
                      (selectedCommitment.targetMeetings - selectedCommitment.currentMeetings) /
                        selectedCommitment.daysRemaining
                        ? 'text-green-400'
                        : 'text-amber-400'
                    }`}
                  >
                    Current: {selectedCommitment.burnRate}/day
                  </span>
                </div>
              </div>

              {/* Variance Alert */}
              {selectedCommitment.status === 'at_risk' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-400 mb-1">Pacing Warning</h4>
                      <p className="text-xs text-amber-300/80">
                        At current rate, you'll miss target by{' '}
                        {Math.ceil(
                          selectedCommitment.targetMeetings -
                            selectedCommitment.currentMeetings -
                            selectedCommitment.burnRate * selectedCommitment.daysRemaining
                        )}{' '}
                        meetings. Consider applying recommended adjustments.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Adjustments */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Recommended Adjustments
          </h3>
          <div className="space-y-3">
            {adjustments.map((adjustment, idx) => (
              <motion.div
                key={adjustment.type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-white">{adjustment.description}</span>
                  {adjustment.autoApplicable && <Zap className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-400">+{adjustment.impact}% impact</span>
                    <span className="text-gray-500 capitalize">{adjustment.effort} effort</span>
                  </div>
                  <button className="px-3 py-1 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 text-xs font-medium rounded transition-colors">
                    Apply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PipelineCommitments };
export default PipelineCommitments;

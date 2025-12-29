import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  Activity,
} from 'lucide-react';

const ExecutionOverlay = ({ status, nodes }) => {
  const completedCount = Object.values(status).filter(s => s === 'completed').length;
  const runningCount = Object.values(status).filter(s => s === 'running').length;
  const errorCount = Object.values(status).filter(s => s === 'error').length;
  const totalNodes = nodes.length;

  const progressPercent = Math.round((completedCount / totalNodes) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[250px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
        <span className="font-semibold text-gray-900 dark:text-white">Execution Progress</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Completed */}
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{completedCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
        </div>

        {/* Running */}
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{runningCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Running</div>
        </div>

        {/* Pending */}
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {totalNodes - completedCount - runningCount - errorCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
        </div>
      </div>

      {/* Error indicator if any */}
      {errorCount > 0 && (
        <div className="mt-4 flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700 dark:text-red-400">
            {errorCount} node(s) failed
          </span>
        </div>
      )}

      {/* Current node indicator */}
      {runningCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Currently executing:</div>
          {nodes
            .filter(node => status[node.id] === 'running')
            .map(node => (
              <div
                key={node.id}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                {node.data?.label || node.type}
              </div>
            ))}
        </div>
      )}

      {/* Estimated time remaining */}
      {runningCount > 0 && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          <Clock className="w-3 h-3 inline mr-1" />~{Math.max(1, (totalNodes - completedCount) * 2)}{' '}
          seconds remaining
        </div>
      )}
    </div>
  );
};

export default ExecutionOverlay;

ExecutionOverlay.propTypes = {
  status: PropTypes.object.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

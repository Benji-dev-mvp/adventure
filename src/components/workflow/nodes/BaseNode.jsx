import React from 'react';
import { Handle, Position } from 'reactflow';
import {
  Trash2,
  Copy,
  MoreVertical,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Base node wrapper with common styling
export const BaseNode = ({
  children,
  icon: Icon,
  label,
  color = 'blue',
  executionStatus,
  onDelete,
  onDuplicate,
  selected,
  hasInput = true,
  hasOutput = true,
  outputCount = 1,
}) => {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    pink: 'border-pink-500 bg-pink-50 dark:bg-pink-900/20',
    indigo: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    emerald: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  };

  const iconColorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    pink: 'bg-pink-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    emerald: 'bg-emerald-500 text-white',
  };

  const statusIcon = {
    running: <Loader2 className="w-4 h-4 animate-spin text-blue-500" />,
    completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
  };

  return (
    <div
      className={`
        relative min-w-[200px] max-w-[280px] rounded-lg border-2 shadow-lg 
        transition-all duration-200 
        ${colorClasses[color]}
        ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
        ${executionStatus === 'running' ? 'animate-pulse' : ''}
        hover:shadow-xl
      `}
    >
      {/* Input Handle */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-400 border-2 border-white dark:border-gray-800"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${iconColorClasses[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">{label}</span>
        </div>

        <div className="flex items-center gap-1">
          {executionStatus && statusIcon[executionStatus]}

          <div className="relative group">
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[120px]">
              <button
                onClick={onDuplicate}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Copy className="w-3 h-3" /> Duplicate
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">{children}</div>

      {/* Output Handle(s) */}
      {hasOutput && (
        <>
          {outputCount === 1 ? (
            <Handle
              type="source"
              position={Position.Bottom}
              className="w-3 h-3 !bg-gray-400 border-2 border-white dark:border-gray-800"
            />
          ) : (
            <>
              <Handle
                type="source"
                position={Position.Bottom}
                id="yes"
                style={{ left: '30%' }}
                className="w-3 h-3 !bg-green-500 border-2 border-white dark:border-gray-800"
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="no"
                style={{ left: '70%' }}
                className="w-3 h-3 !bg-red-500 border-2 border-white dark:border-gray-800"
              />
            </>
          )}
        </>
      )}

      {/* Execution indicator line */}
      {executionStatus === 'completed' && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-500 rounded-full" />
      )}
    </div>
  );
};

export default BaseNode;

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import BaseNode from './BaseNode';

export const DelayNode = ({ data, selected }) => {
  const [days, setDays] = useState(data.days || 2);
  const [hours, setHours] = useState(data.hours || 0);
  const [waitType, setWaitType] = useState(data.waitType || 'duration');

  const getTotalWait = () => {
    const totalHours = days * 24 + hours;
    if (totalHours >= 24) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours > 0 ? `${hours}h` : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <BaseNode
      icon={Clock}
      label={data.label || 'Wait'}
      color="orange"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
    >
      <div className="space-y-3">
        {/* Wait Type */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setWaitType('duration');
              data.onChange?.({ waitType: 'duration' });
            }}
            className={`flex-1 px-2 py-1 text-xs rounded-md border transition-colors ${
              waitType === 'duration'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
            }`}
          >
            Duration
          </button>
          <button
            onClick={() => {
              setWaitType('specific');
              data.onChange?.({ waitType: 'specific' });
            }}
            className={`flex-1 px-2 py-1 text-xs rounded-md border transition-colors ${
              waitType === 'specific'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
            }`}
          >
            Time of Day
          </button>
        </div>

        {waitType === 'duration' ? (
          <div className="flex gap-2">
            {/* Days */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Days
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={days}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setDays(val);
                  data.onChange?.({ days: val });
                }}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              />
            </div>

            {/* Hours */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hours
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setHours(val);
                  data.onChange?.({ hours: val });
                }}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Send at time
            </label>
            <input
              type="time"
              defaultValue="09:00"
              className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        )}

        {/* Summary */}
        <div className="flex items-center justify-center gap-2 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Wait {getTotalWait()}
          </span>
        </div>
      </div>
    </BaseNode>
  );
};

export default DelayNode;

import React, { useState } from 'react';
import { Play, Clock, Users, Zap, Calendar } from 'lucide-react';
import BaseNode from './BaseNode';

export const TriggerNode = ({ data, selected }) => {
  const [triggerType, setTriggerType] = useState(data.triggerType || 'manual');

  const triggerTypes = [
    { value: 'manual', label: 'Manual', icon: Play, description: 'Start manually' },
    { value: 'scheduled', label: 'Scheduled', icon: Calendar, description: 'Run on schedule' },
    { value: 'lead_added', label: 'Lead Added', icon: Users, description: 'When lead is added' },
    { value: 'webhook', label: 'Webhook', icon: Zap, description: 'External trigger' },
  ];

  const selectedTrigger = triggerTypes.find(t => t.value === triggerType);

  return (
    <BaseNode
      icon={Play}
      label={data.label || 'Campaign Start'}
      color="green"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
      hasInput={false}
    >
      <div className="space-y-3">
        {/* Trigger Type Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Trigger Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {triggerTypes.map(trigger => {
              const Icon = trigger.icon;
              return (
                <button
                  key={trigger.value}
                  onClick={() => {
                    setTriggerType(trigger.value);
                    data.onChange?.({ triggerType: trigger.value });
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                    triggerType === trigger.value
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1 ${
                      triggerType === trigger.value ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      triggerType === trigger.value
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {trigger.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule options if scheduled */}
        {triggerType === 'scheduled' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Schedule
            </label>
            <select className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="daily">Daily at 9:00 AM</option>
              <option value="weekdays">Weekdays at 9:00 AM</option>
              <option value="weekly">Weekly on Monday</option>
              <option value="custom">Custom schedule...</option>
            </select>
          </div>
        )}

        {/* Description */}
        <div className="flex items-center gap-2 py-2 px-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          {selectedTrigger && <selectedTrigger.icon className="w-4 h-4 text-green-600" />}
          <span className="text-xs text-green-700 dark:text-green-300">
            {selectedTrigger?.description}
          </span>
        </div>

        {/* Stats when executed */}
        {data.executionStatus === 'completed' && (
          <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Started with 150 leads</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default TriggerNode;

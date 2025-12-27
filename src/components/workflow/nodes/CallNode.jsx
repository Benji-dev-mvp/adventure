import React, { useState } from 'react';
import { Phone, Clock } from 'lucide-react';
import BaseNode from './BaseNode';

export const CallNode = ({ data, selected }) => {
  const [duration, setDuration] = useState(data.duration || 5);
  const [script, setScript] = useState(data.script || '');

  return (
    <BaseNode
      icon={Phone}
      label={data.label || 'Phone Call'}
      color="emerald"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
    >
      <div className="space-y-3">
        {/* Duration */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Expected Duration
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => {
                setDuration(parseInt(e.target.value));
                data.onChange?.({ duration: parseInt(e.target.value) });
              }}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[50px]">
              {duration} min
            </span>
          </div>
        </div>

        {/* Call Script */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Call Script
          </label>
          <textarea
            value={script}
            onChange={(e) => {
              setScript(e.target.value);
              data.onChange?.({ script: e.target.value });
            }}
            placeholder="Opening: Hi {{firstName}}, this is..."
            rows={3}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Call outcomes */}
        <div className="flex gap-1 flex-wrap">
          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Connected</span>
          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">Voicemail</span>
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">No Answer</span>
        </div>

        {/* Stats when executed */}
        {data.executionStatus === 'completed' && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Attempted: 80</span>
            <span>Connected: 24 (30%)</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default CallNode;

import React, { useState } from 'react';
import { Shuffle, BarChart3 } from 'lucide-react';
import BaseNode from './BaseNode';

export const ABTestNode = ({ data, selected }) => {
  const [splitRatio, setSplitRatio] = useState(data.splitRatio || 50);
  const [variantAName, setVariantAName] = useState(data.variantAName || 'Variant A');
  const [variantBName, setVariantBName] = useState(data.variantBName || 'Variant B');

  return (
    <BaseNode
      icon={Shuffle}
      label={data.label || 'A/B Test'}
      color="indigo"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
      outputCount={2}
    >
      <div className="space-y-3">
        {/* Split Ratio Slider */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Traffic Split
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="10"
            value={splitRatio}
            onChange={e => {
              setSplitRatio(parseInt(e.target.value));
              data.onChange?.({ splitRatio: parseInt(e.target.value) });
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-indigo-600 font-medium">{splitRatio}%</span>
            <span className="text-purple-600 font-medium">{100 - splitRatio}%</span>
          </div>
        </div>

        {/* Variant Names */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Variant A
            </label>
            <input
              type="text"
              value={variantAName}
              onChange={e => {
                setVariantAName(e.target.value);
                data.onChange?.({ variantAName: e.target.value });
              }}
              className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Variant B
            </label>
            <input
              type="text"
              value={variantBName}
              onChange={e => {
                setVariantBName(e.target.value);
                data.onChange?.({ variantBName: e.target.value });
              }}
              className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Visual Split */}
        <div className="flex h-3 rounded-full overflow-hidden">
          <div className="bg-indigo-500 transition-all" style={{ width: `${splitRatio}%` }} />
          <div className="bg-purple-500 transition-all" style={{ width: `${100 - splitRatio}%` }} />
        </div>

        {/* Branch labels */}
        <div className="flex justify-between text-xs pt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-indigo-600 dark:text-indigo-400">{variantAName}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-purple-600 dark:text-purple-400">{variantBName}</span>
          </div>
        </div>

        {/* Stats when executed */}
        {data.executionStatus === 'completed' && (
          <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-600">{variantAName}: 75 (50%)</span>
              <span className="text-green-600">15% CTR</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-600">{variantBName}: 75 (50%)</span>
              <span className="text-green-600">22% CTR ⭐</span>
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default ABTestNode;

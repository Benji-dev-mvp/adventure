import React, { useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import BaseNode from './BaseNode';

export const SMSNode = ({ data, selected }) => {
  const [content, setContent] = useState(data.content || '');
  const maxLength = data.maxLength || 160;

  const isOverLimit = content.length > maxLength;

  return (
    <BaseNode
      icon={MessageSquare}
      label={data.label || 'Send SMS'}
      color="purple"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
    >
      <div className="space-y-3">
        {/* SMS Content */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              data.onChange?.({ content: e.target.value });
            }}
            placeholder="Hi {{firstName}}, quick follow-up..."
            rows={3}
            className={`w-full px-2 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 ${
              isOverLimit ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
            }`}
          />
        </div>

        {/* Character count */}
        <div className={`flex items-center justify-between text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
          {isOverLimit && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Over limit!</span>
            </div>
          )}
          <span className="ml-auto">
            {content.length}/{maxLength}
          </span>
        </div>

        {/* Message segments info */}
        {content.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {Math.ceil(content.length / maxLength)} message segment(s)
          </div>
        )}

        {/* Stats when executed */}
        {data.executionStatus === 'completed' && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Sent: 100</span>
            <span>Delivered: 95 (95%)</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default SMSNode;

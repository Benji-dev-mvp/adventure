import React, { useState } from 'react';
import { Linkedin, UserPlus } from 'lucide-react';
import BaseNode from './BaseNode';

export const LinkedInNode = ({ data, selected }) => {
  const [connectionRequest, setConnectionRequest] = useState(data.connectionRequest || false);
  const [messagePreview, setMessagePreview] = useState(data.content || '');

  return (
    <BaseNode
      icon={Linkedin}
      label={data.label || 'LinkedIn Message'}
      color="indigo"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
    >
      <div className="space-y-3">
        {/* Connection Request Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Connection Request
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={connectionRequest}
              onChange={(e) => {
                setConnectionRequest(e.target.checked);
                data.onChange?.({ connectionRequest: e.target.checked });
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Message Preview */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Message
          </label>
          <textarea
            value={messagePreview}
            onChange={(e) => {
              setMessagePreview(e.target.value);
              data.onChange?.({ content: e.target.value });
            }}
            placeholder="Hi {{firstName}}, I noticed..."
            rows={3}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Character count */}
        <div className="text-xs text-gray-400 text-right">
          {messagePreview.length}/300 characters
        </div>

        {/* Stats when executed */}
        {data.executionStatus === 'completed' && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Sent: 120</span>
            <span>Accepted: 35 (29%)</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default LinkedInNode;

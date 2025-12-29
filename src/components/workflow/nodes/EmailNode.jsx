import React, { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import BaseNode from './BaseNode';

export const EmailNode = ({ data, selected }) => {
  const [subject, setSubject] = useState(data.subject || '');
  const [tone, setTone] = useState(data.tone || 'professional');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubject('Follow-up: {{company}} partnership opportunity');
    data.onChange?.({ subject: 'Follow-up: {{company}} partnership opportunity' });
    setIsGenerating(false);
  };

  return (
    <BaseNode
      icon={Mail}
      label={data.label || 'Send Email'}
      color="blue"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
    >
      <div className="space-y-3">
        {/* Subject Line */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Subject
          </label>
          <div className="relative">
            <input
              type="text"
              value={subject}
              onChange={e => {
                setSubject(e.target.value);
                data.onChange?.({ subject: e.target.value });
              }}
              placeholder="Enter subject line..."
              className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Tone
          </label>
          <select
            value={tone}
            onChange={e => {
              setTone(e.target.value);
              data.onChange?.({ tone: e.target.value });
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        {/* AI Generate Button */}
        <button
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-md hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>

        {/* Stats when executed */}
        {data.executionStatus === 'completed' && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Sent: 150</span>
            <span>Opened: 45 (30%)</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default EmailNode;

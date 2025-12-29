import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import BaseNode from './BaseNode';

export const ConditionNode = ({ data, selected }) => {
  const [field, setField] = useState(data.field || 'email_opened');
  const [operator, setOperator] = useState(data.operator || 'equals');
  const [value, setValue] = useState(data.value || 'true');

  const fieldOptions = [
    { value: 'email_opened', label: 'Email Opened' },
    { value: 'email_clicked', label: 'Email Clicked' },
    { value: 'email_replied', label: 'Email Replied' },
    { value: 'linkedin_accepted', label: 'LinkedIn Accepted' },
    { value: 'linkedin_replied', label: 'LinkedIn Replied' },
    { value: 'lead_score', label: 'Lead Score' },
    { value: 'company_size', label: 'Company Size' },
    { value: 'days_since_last', label: 'Days Since Last Contact' },
  ];

  const operatorOptions = [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'not equals' },
    { value: 'greater_than', label: 'greater than' },
    { value: 'less_than', label: 'less than' },
    { value: 'contains', label: 'contains' },
  ];

  const getConditionSummary = () => {
    const fieldLabel = fieldOptions.find(f => f.value === field)?.label || field;
    const opLabel = operatorOptions.find(o => o.value === operator)?.label || operator;
    return `If ${fieldLabel} ${opLabel} ${value}`;
  };

  return (
    <BaseNode
      icon={GitBranch}
      label={data.label || 'Condition'}
      color="pink"
      executionStatus={data.executionStatus}
      onDelete={data.onDelete}
      onDuplicate={data.onDuplicate}
      selected={selected}
      outputCount={2}
    >
      <div className="space-y-3">
        {/* Field */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            If
          </label>
          <select
            value={field}
            onChange={e => {
              setField(e.target.value);
              data.onChange?.({ field: e.target.value });
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {fieldOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Operator */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Operator
          </label>
          <select
            value={operator}
            onChange={e => {
              setOperator(e.target.value);
              data.onChange?.({ operator: e.target.value });
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {operatorOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Value
          </label>
          <input
            type="text"
            value={value}
            onChange={e => {
              setValue(e.target.value);
              data.onChange?.({ value: e.target.value });
            }}
            placeholder="Enter value..."
            className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Branch labels */}
        <div className="flex justify-between text-xs pt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-green-600 dark:text-green-400">Yes</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-red-600 dark:text-red-400">No</span>
          </div>
        </div>

        {/* Stats when executed */}
        {data.executionStatus === 'completed' && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-green-600">Yes: 65</span>
            <span className="text-red-600">No: 85</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default ConditionNode;

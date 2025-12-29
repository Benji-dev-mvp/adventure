import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  CheckSquare,
  Tag,
  UserPlus,
  Trash2,
  Download,
  Archive,
  Star,
  Send,
} from 'lucide-react';

export const BulkActions = ({ selectedLeads = [], onAction }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const actions = [
    {
      id: 'add_to_campaign',
      label: 'Add to Campaign',
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
    },
    {
      id: 'change_status',
      label: 'Change Status',
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
    },
    {
      id: 'assign_owner',
      label: 'Assign Owner',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30',
    },
    {
      id: 'add_tags',
      label: 'Add Tags',
      icon: Tag,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30',
    },
    {
      id: 'mark_favorite',
      label: 'Mark as Favorite',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30',
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: Download,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30',
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600',
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30',
    },
  ];

  const handleAction = async actionId => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onAction?.(actionId, selectedLeads);
    setIsProcessing(false);
  };

  if (selectedLeads.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="text-primary-600 dark:text-primary-400" size={20} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose an action to apply to all selected leads
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction?.('clear_selection')}
            className="text-gray-600 dark:text-gray-400"
          >
            Clear Selection
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={isProcessing}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${action.bgColor} ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Icon className={action.color} size={16} />
                <span className={`text-sm font-medium ${action.color}`}>{action.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

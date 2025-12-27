import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const QuickWins = () => {
  const wins = [
    {
      id: 1,
      title: 'Follow up with 3 hot leads',
      action: 'Send',
      priority: 'high',
      estimatedTime: '5 min',
    },
    {
      id: 2,
      title: 'Personalize campaign',
      action: 'Edit',
      priority: 'high',
      estimatedTime: '15 min',
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-accent-500" size={16} />
          <CardTitle>Quick Wins</CardTitle>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          AI-powered actions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {wins.map((win, index) => (
            <div
              key={win.id}
              className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:border-accent-300 dark:hover:border-accent-500 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-2 flex-1">
                <h4 className="font-semibold text-xs text-gray-900 dark:text-white">
                  {win.title}
                </h4>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor(win.priority)}`}>
                  {win.priority}
                </span>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                className="gap-1 text-xs h-6 px-2 group-hover:bg-accent-500 group-hover:text-white transition-all"
              >
                {win.action}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 flex items-center gap-1 mx-auto">
            <CheckCircle2 size={12} />
            View all tasks
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

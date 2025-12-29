import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Target, Calendar } from 'lucide-react';

export const GoalTracking = () => {
  const goals = [
    {
      id: 1,
      name: 'Monthly Meetings',
      current: 47,
      target: 60,
      unit: 'meetings',
      period: 'This Month',
      color: 'bg-blue-500',
      daysLeft: 5,
    },
    {
      id: 2,
      name: 'Reply Rate',
      current: 8.4,
      target: 10,
      unit: '%',
      period: 'Q1 2025',
      color: 'bg-green-500',
      daysLeft: 65,
    },
    {
      id: 3,
      name: 'Qualified Leads',
      current: 124,
      target: 150,
      unit: 'leads',
      period: 'This Month',
      color: 'bg-purple-500',
      daysLeft: 5,
    },
    {
      id: 4,
      name: 'Pipeline Value',
      current: 285000,
      target: 500000,
      unit: '$',
      period: 'Q1 2025',
      color: 'bg-orange-500',
      daysLeft: 65,
    },
  ];

  const formatValue = (value, unit) => {
    if (unit === '$') {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `${value}${unit === '%' ? '%' : ''}`;
  };

  const getProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatus = progress => {
    if (progress >= 90) return { label: 'On Track', variant: 'success' };
    if (progress >= 70) return { label: 'Good', variant: 'warning' };
    return { label: 'Behind', variant: 'danger' };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-primary-500" size={20} />
            <CardTitle>Goal Tracking</CardTitle>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Manage Goals
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {goals.map(goal => {
            const progress = getProgress(goal.current, goal.target);
            const status = getStatus(progress);

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatValue(goal.current, goal.unit)} of{' '}
                      {formatValue(goal.target, goal.unit)}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${goal.color} transition-all duration-500 rounded-full relative`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute -top-1 right-0 transform translate-y-full">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {goal.period}
                  </span>
                  <span>{goal.daysLeft} days left</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Mail, Target, Sparkles, TrendingUp } from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      icon: Mail,
      title: 'New Campaign',
      description: 'Create a new outreach campaign',
      color: 'bg-blue-100 text-blue-600',
      action: '/campaigns',
    },
    {
      icon: Target,
      title: 'Find Leads',
      description: 'Search 300M+ B2B contacts',
      color: 'bg-green-100 text-green-600',
      action: '/leads',
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Get help from Ava',
      color: 'bg-purple-100 text-purple-600',
      action: '/ai-assistant',
    },
    {
      icon: TrendingUp,
      title: 'View Analytics',
      description: 'Check your performance',
      color: 'bg-orange-100 text-orange-600',
      action: '/analytics',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-start p-4 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-all group text-left"
              >
                <div
                  className={`w-10 h-9 rounded-lg flex items-center justify-center mb-3 ${action.color}`}
                >
                  <Icon size={20} />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h4>
                <p className="text-xs text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

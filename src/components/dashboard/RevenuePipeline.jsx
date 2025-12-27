import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';

export const RevenuePipeline = () => {
  const pipeline = [
    { stage: 'Prospecting', deals: 45, value: 125000, color: 'bg-blue-500' },
    { stage: 'Qualification', deals: 28, value: 245000, color: 'bg-indigo-500' },
    { stage: 'Proposal', deals: 15, value: 380000, color: 'bg-purple-500' },
    { stage: 'Negotiation', deals: 8, value: 290000, color: 'bg-pink-500' },
    { stage: 'Closed Won', deals: 12, value: 485000, color: 'bg-green-500' },
  ];

  const totalValue = pipeline.reduce((sum, stage) => sum + stage.value, 0);
  const maxValue = Math.max(...pipeline.map(s => s.value));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-500" size={20} />
            <CardTitle>Revenue Pipeline</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(totalValue / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pipeline.map((stage, index) => {
            const percentage = (stage.value / maxValue) * 100;
            
            return (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stage.stage}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({stage.deals} deals)
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(stage.value / 1000).toFixed(0)}K
                  </span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Deal</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${(totalValue / pipeline.reduce((sum, s) => sum + s.deals, 0) / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
            <p className="text-lg font-bold text-green-600">23%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Velocity</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">18d</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

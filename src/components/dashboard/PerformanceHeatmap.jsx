import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Clock } from 'lucide-react';

export const PerformanceHeatmap = () => {
  const hours = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Generate mock heatmap data (0-100 scale)
  const data = days.map(() => hours.map(() => Math.floor(Math.random() * 100)));

  const getColor = value => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-green-400';
    if (value >= 40) return 'bg-yellow-400';
    if (value >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getOpacity = value => {
    return value / 100;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="text-primary-500" size={20} />
          <CardTitle>Best Time to Send</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Reply rate heatmap by day and time
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Hours header */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              {hours.map(hour => (
                <div
                  key={hour}
                  className="flex-1 text-center text-xs text-gray-600 dark:text-gray-400 px-1"
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-2">
                <div className="w-12 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </div>
                {data[dayIndex].map((value, hourIndex) => (
                  <div
                    key={hourIndex}
                    className="flex-1 aspect-square m-0.5 rounded cursor-pointer hover:scale-110 transition-transform relative group"
                    style={{
                      backgroundColor: `rgb(34, 197, 94, ${getOpacity(value)})`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-white drop-shadow">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <span className="text-xs text-gray-600 dark:text-gray-400">Less replies</span>
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map(val => (
              <div
                key={val}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: `rgb(34, 197, 94, ${val / 100})` }}
              ></div>
            ))}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">More replies</span>
        </div>
      </CardContent>
    </Card>
  );
};

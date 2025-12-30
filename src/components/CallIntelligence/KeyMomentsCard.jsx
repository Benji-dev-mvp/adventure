import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { getMomentIcon } from '../../lib/callIntelligenceData';

export const KeyMomentsCard = ({ moments }) => (
  <Card>
    <CardHeader>
      <CardTitle>Key Moments</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {moments.map((moment, i) => (
          <div key={i} className="flex gap-2">
            {getMomentIcon(moment.type)}
            <div className="flex-1">
              <p className="text-xs text-gray-500">{moment.time}</p>
              <p className="text-sm">{moment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Download } from 'lucide-react';
import { getSentimentColor } from '../../lib/callIntelligenceData';

export const TranscriptCard = ({ call }) => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle>{call.lead}</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {call.date} • {call.duration}
          </p>
        </div>
        <Badge variant={call.sentiment === 'positive' ? 'success' : 'secondary'}>
          {call.sentiment} ({call.score}%)
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {call.transcript.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-xs text-gray-500 min-w-[40px]">{line.time}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                {line.speaker}
              </p>
              <p className={`text-sm ${getSentimentColor(line.sentiment)}`}>{line.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full mt-4">
        <Download className="w-4 h-4 mr-2" />
        Export Transcript
      </Button>
    </CardContent>
  </Card>
);

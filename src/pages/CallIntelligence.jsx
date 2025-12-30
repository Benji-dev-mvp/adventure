import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Lightbulb, Download } from 'lucide-react';
import { MOCK_CALL_DATA, getSentimentColor, getMomentIcon } from '../lib/callIntelligenceData';

const CallIntelligence = () => {
  const [selectedCall, setSelectedCall] = useState(0);
  const call = MOCK_CALL_DATA[selectedCall];

  return (
    <DashboardLayout title="Call Intelligence" subtitle="AI-powered call analysis and insights">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Transcript */}
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

        {/* Insights */}
        <div className="space-y-3">
          {/* Key Moments */}
          <Card>
            <CardHeader>
              <CardTitle>Key Moments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {call.keyMoments.map((moment, i) => (
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

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {call.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CallIntelligence;

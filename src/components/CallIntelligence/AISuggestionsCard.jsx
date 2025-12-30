import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Lightbulb } from 'lucide-react';

export const AISuggestionsCard = ({ suggestions }) => (
  <Card>
    <CardHeader>
      <CardTitle>AI Suggestions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <div key={i} className="flex gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{suggestion}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

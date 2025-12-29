// Lead Database Advanced Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Search, Users, TrendingUp, Building2, Layers } from 'lucide-react';

export const BooleanSearchBuilder = () => {
  const [query, setQuery] = useState('');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="text-primary-500" size={20} />
          <CardTitle>Advanced Boolean Search</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Search Query</label>
            <Input
              placeholder='(title:"CEO" OR title:"CTO") AND company:"Tech" AND location:"San Francisco"'
              className="mt-1 font-mono text-sm"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => setQuery(query + ' AND ')}>
              AND
            </Button>
            <Button size="sm" variant="outline" onClick={() => setQuery(query + ' OR ')}>
              OR
            </Button>
            <Button size="sm" variant="outline" onClick={() => setQuery(query + ' NOT ')}>
              NOT
            </Button>
          </div>
          <Button className="w-full">Search 50M+ Leads</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const LookalikeAudience = () => {
  const [selectedLeads, setSelectedLeads] = useState(5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="text-primary-500" size={20} />
          <CardTitle>Lookalike Audience Builder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium mb-2">Selected Seed Leads: {selectedLeads}</p>
            <p className="text-xs text-gray-600">
              We'll find similar leads based on company size, industry, tech stack, and job titles
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Similarity Threshold</label>
            <input type="range" min="50" max="100" className="w-full mt-2" defaultValue="80" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50% (More leads)</span>
              <span>100% (Exact match)</span>
            </div>
          </div>
          <Button className="w-full">Generate 2,450 Lookalike Leads</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const IntentSignals = () => {
  const signals = [
    { type: 'Hiring', score: 92, details: '5 new engineering roles posted' },
    { type: 'Funding', score: 88, details: 'Series B $25M raised 2 weeks ago' },
    { type: 'Tech Stack', score: 75, details: 'Recently adopted Salesforce' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Intent Signal Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {signals.map(signal => (
            <div key={signal.type} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{signal.type}</h4>
                <Badge variant={signal.score > 85 ? 'success' : 'warning'}>
                  {signal.score}% match
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{signal.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const CompanyHierarchy = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="text-primary-500" size={20} />
          <CardTitle>Company Hierarchy Mapping</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
            <p className="font-semibold">Acme Corp (Parent)</p>
            <p className="text-sm text-gray-600">Fortune 500 • 50,000 employees</p>
          </div>
          <div className="ml-6 space-y-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Acme Tech (Subsidiary)</p>
              <p className="text-xs text-gray-600">2,500 employees • San Francisco</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">Acme Labs (Subsidiary)</p>
              <p className="text-xs text-gray-600">800 employees • Boston</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ContactWaterfall = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="text-primary-500" size={20} />
          <CardTitle>Contact Waterfall Strategy</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold">
              1
            </div>
            <div>
              <p className="font-medium">CEO / C-Level</p>
              <p className="text-xs text-gray-600">Primary decision maker</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
              2
            </div>
            <div>
              <p className="font-medium">VP / Director</p>
              <p className="text-xs text-gray-600">If no response after 3 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Manager</p>
              <p className="text-xs text-gray-600">Fallback contact</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

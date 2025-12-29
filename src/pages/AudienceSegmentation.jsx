import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { Plus, X, Users, Save } from 'lucide-react';

const AudienceSegmentation = () => {
  const [rules, setRules] = useState([{ id: 1, field: 'score', operator: 'gte', value: '70' }]);
  const [matchCount, setMatchCount] = useState(187);
  const [segmentName, setSegmentName] = useState('High Score Leads');

  const addRule = () => {
    setRules([...rules, { id: Date.now(), field: 'industry', operator: 'equals', value: '' }]);
  };

  const removeRule = id => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id, key, value) => {
    setRules(rules.map(r => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const savedSegments = [
    { name: 'Enterprise Tech', count: 432, rules: 3 },
    { name: 'SMB Healthcare', count: 189, rules: 4 },
    { name: 'Hot Leads', count: 67, rules: 2 },
  ];

  return (
    <DashboardLayout
      title="Audience Segmentation"
      subtitle="Build smart segments with advanced filters"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Builder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Segment Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Segment Name</label>
              <input
                type="text"
                value={segmentName}
                onChange={e => setSegmentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-gray-800"
                placeholder="e.g. Enterprise Tech Leads"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Matching Rules</p>
                <Button size="sm" variant="outline" onClick={addRule}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Rule
                </Button>
              </div>

              {rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="p-4 border border-gray-200 dark:border-white/10 rounded-lg space-y-2"
                >
                  {index > 0 && <div className="text-sm font-medium text-gray-600 mb-2">AND</div>}
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <select
                        value={rule.field}
                        onChange={e => updateRule(rule.id, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-gray-800 text-sm"
                      >
                        <option value="score">Lead Score</option>
                        <option value="industry">Industry</option>
                        <option value="size">Company Size</option>
                        <option value="engagement">Engagement</option>
                        <option value="tech">Tech Stack</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <select
                        value={rule.operator}
                        onChange={e => updateRule(rule.id, 'operator', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-gray-800 text-sm"
                      >
                        <option value="equals">Equals</option>
                        <option value="gte">Greater than</option>
                        <option value="lte">Less than</option>
                        <option value="contains">Contains</option>
                      </select>
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={rule.value}
                        onChange={e => updateRule(rule.id, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-gray-800 text-sm"
                        placeholder="Value"
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Live Preview</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Matching leads in database
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{matchCount}</p>
                  <p className="text-xs text-gray-600">leads match</p>
                </div>
              </div>
            </div>

            <Button variant="gradient" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Segment
            </Button>
          </CardContent>
        </Card>

        {/* Saved Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedSegments.map((segment, i) => (
                <div
                  key={i}
                  className="p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:border-accent-500 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm">{segment.name}</p>
                    <Badge variant="secondary" size="sm">
                      {segment.rules} rules
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{segment.count} leads</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AudienceSegmentation;

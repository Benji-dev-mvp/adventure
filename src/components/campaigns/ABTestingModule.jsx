import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { FlaskConical, Plus, X, BarChart3 } from 'lucide-react';

export const ABTestingModule = ({ onSave }) => {
  const [variants, setVariants] = useState([
    { id: 'A', name: 'Variant A (Control)', subject: '', content: '', allocation: 50 },
    { id: 'B', name: 'Variant B', subject: '', content: '', allocation: 50 },
  ]);

  const [testDuration, setTestDuration] = useState('7');
  const [winMetric, setWinMetric] = useState('open_rate');

  const addVariant = () => {
    const nextLetter = String.fromCodePoint(65 + variants.length);
    const newAllocation = Math.floor(100 / (variants.length + 1));

    setVariants([
      ...variants.map(v => ({ ...v, allocation: newAllocation })),
      {
        id: nextLetter,
        name: `Variant ${nextLetter}`,
        subject: '',
        content: '',
        allocation: newAllocation,
      },
    ]);
  };

  const removeVariant = id => {
    if (variants.length <= 2) return;
    const filtered = variants.filter(v => v.id !== id);
    const newAllocation = Math.floor(100 / filtered.length);
    setVariants(filtered.map(v => ({ ...v, allocation: newAllocation })));
  };

  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => (v.id === id ? { ...v, [field]: value } : v)));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="text-purple-500" size={20} />
            <CardTitle>A/B Testing</CardTitle>
          </div>
          <Badge variant="accent">Split Test</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Test different variations to find what performs best
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Test Configuration */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test Duration
              </label>
              <select
                value={testDuration}
                onChange={e => setTestDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Winning Metric
              </label>
              <select
                value={winMetric}
                onChange={e => setWinMetric(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="open_rate">Open Rate</option>
                <option value="click_rate">Click Rate</option>
                <option value="reply_rate">Reply Rate</option>
                <option value="meeting_rate">Meeting Booked</option>
              </select>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="p-4 border border-gray-200 dark:border-white/10 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary-600">{variant.id}</span>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={e => updateVariant(variant.id, 'name', e.target.value)}
                      className="font-medium text-gray-900 dark:text-white bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {variant.allocation}% traffic
                    </span>
                    {variants.length > 2 && (
                      <button
                        onClick={() => removeVariant(variant.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Subject Line"
                    placeholder={`Subject line for variant ${variant.id}`}
                    value={variant.subject}
                    onChange={e => updateVariant(variant.id, 'subject', e.target.value)}
                  />
                  <Textarea
                    label="Email Content"
                    placeholder={`Email content for variant ${variant.id}`}
                    value={variant.content}
                    onChange={e => updateVariant(variant.id, 'content', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
            <Button variant="outline" size="sm" onClick={addVariant} className="gap-2">
              <Plus size={16} />
              Add Variant
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button onClick={() => onSave?.(variants)} className="gap-2">
                <BarChart3 size={16} />
                Start A/B Test
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ABTestingModule.propTypes = {
  onSave: PropTypes.func,
};

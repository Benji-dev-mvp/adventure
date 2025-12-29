// Template Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FileText, TrendingUp, ShoppingCart, GitBranch, Star } from 'lucide-react';

export const RichTemplateEditor = () => {
  const [content, setContent] = useState('Hi {{firstName}},\n\nI noticed...');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="text-primary-500" size={20} />
          <CardTitle>Rich Text Template Editor</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2 border-b pb-2">
            <Button size="sm" variant="outline">
              Bold
            </Button>
            <Button size="sm" variant="outline">
              Italic
            </Button>
            <Button size="sm" variant="outline">
              Link
            </Button>
            <Button size="sm" variant="outline">
              Variable
            </Button>
          </div>
          <textarea
            className="w-full p-3 border rounded-lg font-mono text-sm"
            rows={8}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Preview
            </Button>
            <Button size="sm">Save Template</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TemplateVersioning = () => {
  const versions = [
    { version: 'v3 (Current)', date: '2 days ago', openRate: '42%', replyRate: '8%' },
    { version: 'v2', date: '1 week ago', openRate: '38%', replyRate: '6%' },
    { version: 'v1', date: '2 weeks ago', openRate: '35%', replyRate: '5%' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="text-primary-500" size={20} />
          <CardTitle>Template Version History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {versions.map(v => (
            <div
              key={v.version}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-semibold">{v.version}</p>
                <p className="text-xs text-gray-600">{v.date}</p>
              </div>
              <div className="text-right text-sm">
                <p>
                  Open: {v.openRate} • Reply: {v.replyRate}
                </p>
                <Button size="sm" variant="outline" className="mt-1">
                  Restore
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const TemplatePerformance = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Template Performance Comparison</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Cold Outreach V3</h4>
              <Badge variant="success">Best Performer</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Open Rate</p>
                <p className="text-lg font-bold">45%</p>
              </div>
              <div>
                <p className="text-gray-600">Reply Rate</p>
                <p className="text-lg font-bold">12%</p>
              </div>
              <div>
                <p className="text-gray-600">Meetings</p>
                <p className="text-lg font-bold">18</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TemplateMarketplace = () => {
  const templates = [
    { name: 'SaaS Cold Intro', author: 'Artisan Team', rating: 4.8, price: 'Free' },
    { name: 'Event Follow-up', author: 'Community', rating: 4.6, price: '$9' },
    { name: 'Product Launch', author: 'Pro User', rating: 4.9, price: '$15' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-primary-500" size={20} />
          <CardTitle>Template Marketplace</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map(t => (
            <div key={t.name} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-xs text-gray-600">by {t.author}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500" size={14} fill="currentColor" />
                  <span className="text-sm font-medium">{t.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-primary-600">{t.price}</span>
                <Button size="sm">{t.price === 'Free' ? 'Add' : 'Purchase'}</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

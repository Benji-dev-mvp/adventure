import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, Mail, Briefcase, Zap, TrendingUp, Target } from 'lucide-react';

export const CampaignTemplatesLibrary = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Templates', count: 24 },
    { id: 'saas', label: 'SaaS', count: 8 },
    { id: 'enterprise', label: 'Enterprise', count: 6 },
    { id: 'ecommerce', label: 'E-commerce', count: 5 },
    { id: 'agency', label: 'Agency', count: 5 },
  ];

  const templates = [
    {
      id: 1,
      name: 'Cold Outreach - SaaS',
      category: 'saas',
      description: '3-step sequence for B2B SaaS prospects with decision-making authority',
      steps: 3,
      channels: ['Email', 'LinkedIn'],
      replyRate: 12.4,
      popular: true,
      preview: 'Hi {{firstName}}, I noticed {{company}} is growing rapidly...',
    },
    {
      id: 2,
      name: 'Product Launch Announcement',
      category: 'saas',
      description: 'Multi-channel campaign for product launches with early access offers',
      steps: 4,
      channels: ['Email', 'LinkedIn', 'SMS'],
      replyRate: 18.7,
      popular: true,
      preview: 'We\'re launching something exciting at {{company}}...',
    },
    {
      id: 3,
      name: 'Re-engagement Campaign',
      category: 'all',
      description: 'Win back cold leads with value-focused messaging',
      steps: 2,
      channels: ['Email'],
      replyRate: 6.8,
      popular: false,
      preview: 'It\'s been a while since we last connected...',
    },
    {
      id: 4,
      name: 'Enterprise Decision Maker',
      category: 'enterprise',
      description: 'Executive-level outreach with ROI focus and case studies',
      steps: 5,
      channels: ['Email', 'LinkedIn', 'Call'],
      replyRate: 9.2,
      popular: true,
      preview: 'Hi {{firstName}}, I wanted to share how we helped {{similarCompany}}...',
    },
    {
      id: 5,
      name: 'Event Follow-up',
      category: 'all',
      description: 'Nurture leads after conference or webinar attendance',
      steps: 3,
      channels: ['Email', 'LinkedIn'],
      replyRate: 15.3,
      popular: false,
      preview: 'Great meeting you at {{eventName}}...',
    },
    {
      id: 6,
      name: 'Free Trial Conversion',
      category: 'saas',
      description: 'Convert free trial users to paid customers',
      steps: 4,
      channels: ['Email', 'SMS'],
      replyRate: 22.1,
      popular: true,
      preview: 'You\'ve been using {{product}} for {{days}} days...',
    },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-500" size={20} />
          <CardTitle>Campaign Templates Library</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Pre-built sequences optimized for different industries and use cases
        </p>
      </CardHeader>
      <CardContent>
        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className="p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:border-primary-300 dark:hover:border-primary-500 transition-all group cursor-pointer text-left w-full"
              onClick={() => onSelect?.(template)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(template); } }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h4>
                    {template.popular && (
                      <Badge variant="accent" className="text-xs">Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs text-gray-600 dark:text-gray-400">
                <span>{template.steps} steps</span>
                <span>•</span>
                <span>{template.channels.join(', ')}</span>
                <span>•</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {template.replyRate}% reply rate
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded text-xs text-gray-600 dark:text-gray-400 mb-3 italic">
                "{template.preview}"
              </div>

              <Button 
                size="sm" 
                variant="outline"
                className="w-full group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all"
              >
                Use Template
              </Button>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

CampaignTemplatesLibrary.propTypes = {
  onSelect: PropTypes.func
};
  );
};

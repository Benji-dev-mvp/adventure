// Content & Media + Search & Discovery + Developer + Testing Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  Image,
  Video,
  FileEdit,
  FileText,
  Presentation,
  Award,
  Star,
  Search,
  Filter,
  Copy,
  X,
  Code,
  Webhook,
  BarChart2,
  Puzzle,
  Terminal,
  FlaskConical,
  Clock,
  Thermometer,
} from 'lucide-react';

// CONTENT & MEDIA COMPONENTS
export const GIFMemeLibrary = () => {
  const [library] = useState([
    { name: 'Celebration GIFs', count: 45, category: 'reactions' },
    { name: 'Tech Memes', count: 67, category: 'humor' },
    { name: 'Professional GIFs', count: 34, category: 'business' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Image className="text-primary-500" size={20} />
          <CardTitle>GIF & Meme Library</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Input placeholder="Search GIFs and memes..." className="mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {library.map((item, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-xs font-medium">{item.name}</p>
              <Badge variant="secondary" className="text-xs mt-1">
                {item.count}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const VideoRecorder = () => {
  const [recordings] = useState([
    { name: 'Product Demo', duration: '3:24', date: 'Dec 24' },
    { name: 'Welcome Message', duration: '1:45', date: 'Dec 23' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Video className="text-primary-500" size={20} />
          <CardTitle>Video Recorder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Button className="w-full mb-3">🎥 Start Recording</Button>
        <div className="space-y-2">
          {recordings.map((rec, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 border rounded">
              <div>
                <p className="text-sm font-medium">{rec.name}</p>
                <p className="text-xs text-gray-600">{rec.duration}</p>
              </div>
              <Button size="sm" variant="outline">
                Play
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const ImageEditor = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileEdit className="text-primary-500" size={20} />
          <CardTitle>Image Editor</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-8 text-center mb-3">
          <Image size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Drop image or click to upload</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Crop
          </Button>
          <Button size="sm" variant="outline">
            Resize
          </Button>
          <Button size="sm" variant="outline">
            Filters
          </Button>
          <Button size="sm" variant="outline">
            Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const DocumentTracking = () => {
  const [docs] = useState([
    { name: 'Product Brochure.pdf', views: 34, downloads: 12, avgTime: '2:34' },
    { name: 'Pricing Sheet.pdf', views: 67, downloads: 23, avgTime: '1:45' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="text-primary-500" size={20} />
          <CardTitle>Document Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {docs.map((doc, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">{doc.name}</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-600">Views</p>
                  <p className="font-bold">{doc.views}</p>
                </div>
                <div>
                  <p className="text-gray-600">Downloads</p>
                  <p className="font-bold">{doc.downloads}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Time</p>
                  <p className="font-bold">{doc.avgTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const PresentationBuilder = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Presentation className="text-primary-500" size={20} />
          <CardTitle>Presentation Builder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Button className="w-full mb-3">+ Create New Deck</Button>
        <div className="space-y-2">
          <div className="p-3 border rounded-lg">
            <p className="font-semibold text-sm">Enterprise Sales Deck</p>
            <p className="text-xs text-gray-600">24 slides • Updated 2 days ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// SEARCH & DISCOVERY COMPONENTS
export const GlobalSearch = () => {
  const [results] = useState([
    { type: 'Lead', name: 'John Doe - Acme Corp', match: 'Email, Phone' },
    { type: 'Campaign', name: 'Q4 Outreach', match: 'Name' },
    { type: 'Template', name: 'Cold Intro V3', match: 'Content' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="text-primary-500" size={20} />
          <CardTitle>Global Search</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Input placeholder="Search across all data..." className="mb-3" />
        <div className="space-y-2">
          {results.map((result, idx) => (
            <div
              key={idx}
              className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <div className="flex gap-2 items-start">
                <Badge variant="secondary" className="text-xs">
                  {result.type}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{result.name}</p>
                  <p className="text-xs text-gray-600">Match: {result.match}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const SmartFilters = () => {
  const [suggested] = useState([
    'High score leads (>80)',
    'Opened last 3 emails',
    'No activity in 30 days',
    'Enterprise companies',
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="text-primary-500" size={20} />
          <CardTitle>Smart Filters</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">AI-suggested filters based on your activity:</p>
        <div className="space-y-2">
          {suggested.map((filter, idx) => (
            <Button key={idx} variant="outline" size="sm" className="w-full justify-start">
              {filter}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const DuplicateDetection = () => {
  const [duplicates] = useState([
    { lead1: 'John Doe - john@acme.com', lead2: 'J. Doe - jdoe@acme.com', confidence: 95 },
    { lead1: 'Acme Corporation', lead2: 'Acme Corp', confidence: 88 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Copy className="text-primary-500" size={20} />
          <CardTitle>Duplicate Detection</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {duplicates.map((dup, idx) => (
            <div key={idx} className="p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="warning">{dup.confidence}% match</Badge>
              </div>
              <p className="text-sm mb-1">{dup.lead1}</p>
              <p className="text-sm text-gray-600 mb-2">{dup.lead2}</p>
              <div className="flex gap-2">
                <Button size="sm">Merge</Button>
                <Button size="sm" variant="outline">
                  Keep Both
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// DEVELOPER TOOLS COMPONENTS
export const GraphQLPlayground = () => {
  const [query, setQuery] = useState(
    'query {\n  leads(limit: 10) {\n    id\n    name\n    email\n  }\n}'
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="text-primary-500" size={20} />
          <CardTitle>GraphQL Playground</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full p-3 border rounded-lg font-mono text-xs"
          rows={6}
        />
        <Button className="w-full mt-3">Execute Query</Button>
      </CardContent>
    </Card>
  );
};

export const WebhookTestConsole = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="text-primary-500" size={20} />
          <CardTitle>Webhook Test Console</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Input placeholder="Webhook URL" className="mb-2" />
        <select className="w-full p-2 border rounded-lg mb-2">
          <option>lead_created</option>
          <option>email_opened</option>
          <option>deal_won</option>
        </select>
        <Button className="w-full">Send Test Event</Button>
      </CardContent>
    </Card>
  );
};

export const APIRateLimitDashboard = () => {
  const [usage] = useState({
    current: 2340,
    limit: 10000,
    remaining: 7660,
    resetsIn: '45 min',
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart2 className="text-primary-500" size={20} />
          <CardTitle>API Rate Limits</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Usage</span>
              <span>
                {usage.current} / {usage.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(usage.current / usage.limit) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded">
              <p className="text-xs text-gray-600">Remaining</p>
              <p className="font-bold">{usage.remaining}</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded">
              <p className="text-xs text-gray-600">Resets In</p>
              <p className="font-bold">{usage.resetsIn}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ZapierIntegration = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Puzzle className="text-primary-500" size={20} />
          <CardTitle>Zapier Integration</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4">
          <Badge variant="success" className="mb-3">
            ✓ Connected
          </Badge>
          <p className="text-sm text-gray-600 mb-3">5,000+ apps available</p>
          <Button>Create Zap</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// TESTING & OPTIMIZATION COMPONENTS
export const MultivariateTestBuilder = () => {
  const [variants] = useState([
    { name: 'Variant A', openRate: 42, clicks: 156 },
    { name: 'Variant B', openRate: 38, clicks: 134 },
    { name: 'Variant C', openRate: 45, clicks: 178 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FlaskConical className="text-primary-500" size={20} />
          <CardTitle>Multivariate Testing</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {variants.map((variant, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">{variant.name}</h4>
                {variant.openRate === Math.max(...variants.map(v => v.openRate)) && (
                  <Badge variant="success">Winner</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-xs">
                <div>
                  <p className="text-gray-600">Open Rate</p>
                  <p className="font-bold">{variant.openRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Clicks</p>
                  <p className="font-bold">{variant.clicks}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const SendTimeABTesting = () => {
  const [times] = useState([
    { time: '9:00 AM', openRate: 38, replyRate: 8 },
    { time: '1:00 PM', openRate: 42, replyRate: 12 },
    { time: '5:00 PM', openRate: 35, replyRate: 6 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="text-primary-500" size={20} />
          <CardTitle>Send Time A/B Testing</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {times.map((slot, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 border rounded">
              <span className="font-medium text-sm">{slot.time}</span>
              <div className="text-right text-xs">
                <p>
                  Open: <strong>{slot.openRate}%</strong>
                </p>
                <p>
                  Reply: <strong className="text-green-600">{slot.replyRate}%</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const EmailHeatmapTracker = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Thermometer className="text-primary-500" size={20} />
          <CardTitle>Email Heatmap Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 bg-gradient-to-b from-red-100 to-blue-100 dark:from-red-900/20 dark:to-blue-900/20">
          <p className="text-sm mb-2">Email Preview</p>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-red-200 dark:bg-red-800/30 rounded">Header (89% clicks)</div>
            <div className="p-2 bg-yellow-200 dark:bg-yellow-800/30 rounded">Body (45% clicks)</div>
            <div className="p-2 bg-green-200 dark:bg-green-800/30 rounded">CTA (92% clicks)</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">🔴 Hot zones | 🟡 Medium | 🟢 Low engagement</p>
      </CardContent>
    </Card>
  );
};

// Sales Intelligence Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  Code2,
  Briefcase,
  DollarSign,
  Newspaper,
  Mic,
  Target,
  BarChart3,
  Users,
} from 'lucide-react';

export const TechnographicFilters = () => {
  const [selectedTech, setSelectedTech] = useState([]);
  const techCategories = [
    { name: 'CRM', options: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho'], count: 2340 },
    { name: 'Analytics', options: ['Google Analytics', 'Mixpanel', 'Amplitude'], count: 3450 },
    { name: 'Marketing', options: ['Marketo', 'Pardot', 'ActiveCampaign'], count: 1890 },
    { name: 'Dev Tools', options: ['GitHub', 'GitLab', 'Bitbucket'], count: 5670 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code2 className="text-primary-500" size={20} />
          <CardTitle>Technographic Filters</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input placeholder="Search technologies..." />

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {techCategories.map((category, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">{category.name}</h4>
                  <Badge variant="secondary">{category.count} companies</Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {category.options.map(tech => (
                    <Button key={tech} size="sm" variant="outline" className="text-xs">
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const JobChangeAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      name: 'Sarah Johnson',
      oldCompany: 'Acme Corp',
      newCompany: 'TechCo',
      newTitle: 'VP of Sales',
      date: '2 days ago',
    },
    {
      name: 'Mike Chen',
      oldCompany: 'StartupXYZ',
      newCompany: 'BigCorp',
      newTitle: 'CTO',
      date: '5 days ago',
    },
    {
      name: 'Lisa Brown',
      oldCompany: 'SmallCo',
      newCompany: 'Acme Corp',
      newTitle: 'Director of Marketing',
      date: '1 week ago',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="text-primary-500" size={20} />
          <CardTitle>Job Change Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{alert.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {alert.date}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {alert.oldCompany} → <strong>{alert.newCompany}</strong>
              </p>
              <p className="text-sm text-primary-600 font-medium">{alert.newTitle}</p>
              <Button size="sm" className="mt-2">
                Reach Out
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Configure Alerts
        </Button>
      </CardContent>
    </Card>
  );
};

export const FundingEventTriggers = () => {
  const [events, setEvents] = useState([
    {
      company: 'TechStartup Inc',
      round: 'Series B',
      amount: '$25M',
      lead: 'Sequoia Capital',
      date: '3 days ago',
    },
    {
      company: 'AI Solutions',
      round: 'Series A',
      amount: '$12M',
      lead: 'Andreessen Horowitz',
      date: '1 week ago',
    },
    {
      company: 'CloudCo',
      round: 'Seed',
      amount: '$3.5M',
      lead: 'Y Combinator',
      date: '2 weeks ago',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="text-primary-500" size={20} />
          <CardTitle>Funding Event Triggers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, idx) => (
            <div key={idx} className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{event.company}</h4>
                <Badge variant="success">{event.round}</Badge>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong className="text-green-600">{event.amount}</strong> raised
                </p>
                <p className="text-gray-600">Lead: {event.lead}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </div>
              <Button size="sm" className="mt-2">
                Add to Campaign
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Set Up Triggers
        </Button>
      </CardContent>
    </Card>
  );
};

export const NewsMonitoring = () => {
  const [news, setNews] = useState([
    {
      company: 'Acme Corp',
      headline: 'Announces new product line',
      source: 'TechCrunch',
      date: '1 hour ago',
      relevance: 'high',
    },
    {
      company: 'TechCo',
      headline: 'Expands to European market',
      source: 'Bloomberg',
      date: '3 hours ago',
      relevance: 'high',
    },
    {
      company: 'StartupXYZ',
      headline: 'Wins industry award',
      source: 'Forbes',
      date: '1 day ago',
      relevance: 'medium',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper className="text-primary-500" size={20} />
          <CardTitle>News Monitoring</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news.map((item, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{item.company}</h4>
                <Badge variant={item.relevance === 'high' ? 'success' : 'warning'}>
                  {item.relevance}
                </Badge>
              </div>
              <p className="text-sm mb-2">{item.headline}</p>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>{item.source}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          View All News
        </Button>
      </CardContent>
    </Card>
  );
};

export const SocialListening = () => {
  const [conversations, setConversations] = useState([
    {
      platform: 'Twitter',
      user: '@techceo',
      text: 'Looking for a new CRM solution...',
      engagement: 45,
      sentiment: 'neutral',
    },
    {
      platform: 'LinkedIn',
      user: 'Sarah J.',
      text: 'Anyone using automation tools for sales?',
      engagement: 89,
      sentiment: 'positive',
    },
    {
      platform: 'Reddit',
      user: 'u/sales_pro',
      text: 'Best lead generation platform?',
      engagement: 234,
      sentiment: 'neutral',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mic className="text-primary-500" size={20} />
          <CardTitle>Social Listening</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conversations.map((conv, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {conv.platform}
                  </Badge>
                  <span className="font-semibold text-sm">{conv.user}</span>
                </div>
                <span className="text-xs text-gray-500">{conv.engagement} interactions</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{conv.text}</p>
              <Button size="sm" variant="outline">
                Engage
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const CompetitorTracking = () => {
  const [competitors, setCompetitors] = useState([
    { name: 'Competitor A', wins: 12, losses: 8, deals: 20, avgDeal: '$42K' },
    { name: 'Competitor B', wins: 8, losses: 15, deals: 23, avgDeal: '$38K' },
    { name: 'Competitor C', wins: 5, losses: 18, deals: 23, avgDeal: '$45K' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="text-primary-500" size={20} />
          <CardTitle>Competitor Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {competitors.map((comp, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-3">{comp.name}</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-600">Wins</p>
                  <p className="font-bold text-green-600">{comp.wins}</p>
                </div>
                <div>
                  <p className="text-gray-600">Losses</p>
                  <p className="font-bold text-red-600">{comp.losses}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total</p>
                  <p className="font-bold">{comp.deals}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Deal</p>
                  <p className="font-bold">{comp.avgDeal}</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(comp.wins / comp.deals) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const MarketSegmentation = () => {
  const segments = [
    { name: 'Enterprise', size: 234, revenue: '$2.4M', growth: '+15%', avgDeal: '$45K' },
    { name: 'Mid-Market', size: 567, revenue: '$1.8M', growth: '+22%', avgDeal: '$28K' },
    { name: 'SMB', size: 1234, revenue: '$1.2M', growth: '+8%', avgDeal: '$12K' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="text-primary-500" size={20} />
          <CardTitle>Market Segmentation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {segments.map((segment, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold">{segment.name}</h4>
                <Badge variant="success">{segment.growth}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Accounts</p>
                  <p className="font-bold">{segment.size}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Revenue</p>
                  <p className="font-bold text-green-600">{segment.revenue}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Avg Deal</p>
                  <p className="font-bold">{segment.avgDeal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const BuyingCommitteeMapper = () => {
  const [committee, setCommittee] = useState({
    company: 'Acme Corp',
    members: [
      {
        name: 'John Doe',
        title: 'CEO',
        role: 'Economic Buyer',
        influence: 'high',
        contacted: true,
      },
      {
        name: 'Jane Smith',
        title: 'CTO',
        role: 'Technical Buyer',
        influence: 'high',
        contacted: true,
      },
      {
        name: 'Bob Johnson',
        title: 'VP Sales',
        role: 'Champion',
        influence: 'medium',
        contacted: false,
      },
      {
        name: 'Alice Williams',
        title: 'Sales Manager',
        role: 'End User',
        influence: 'low',
        contacted: false,
      },
    ],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="text-primary-500" size={20} />
          <CardTitle>Buying Committee Mapper</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold text-lg">{committee.company}</h3>
          <p className="text-sm text-gray-600">
            {committee.members.length} decision makers identified
          </p>
        </div>

        <div className="space-y-2">
          {committee.members.map((member, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{member.name}</h4>
                  <p className="text-xs text-gray-600">{member.title}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      member.influence === 'high'
                        ? 'success'
                        : member.influence === 'medium'
                          ? 'warning'
                          : 'secondary'
                    }
                    className="text-xs mb-1"
                  >
                    {member.influence}
                  </Badge>
                  {member.contacted && (
                    <Badge variant="success" className="text-xs block">
                      ✓ Contacted
                    </Badge>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

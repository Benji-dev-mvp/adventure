// Account-Based Marketing (ABM) Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Network,
  Radio,
  MapPin,
  Activity,
} from 'lucide-react';

export const AccountScoring = () => {
  const [accounts, setAccounts] = useState([
    { name: 'Acme Corp', score: 92, engagement: 'high', revenue: '$450K', contacts: 12 },
    { name: 'TechCo', score: 85, engagement: 'high', revenue: '$380K', contacts: 8 },
    { name: 'StartupXYZ', score: 67, engagement: 'medium', revenue: '$120K', contacts: 5 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="text-primary-500" size={20} />
          <CardTitle>Account Scoring</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accounts.map((account, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{account.name}</h4>
                <Badge
                  variant={
                    account.score > 80 ? 'success' : account.score > 60 ? 'warning' : 'secondary'
                  }
                >
                  Score: {account.score}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-600">Revenue</p>
                  <p className="font-bold">{account.revenue}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contacts</p>
                  <p className="font-bold">{account.contacts}</p>
                </div>
                <div>
                  <p className="text-gray-600">Engagement</p>
                  <p className="font-bold capitalize">{account.engagement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const MultiThreadCampaigns = () => {
  const campaigns = [
    {
      account: 'Acme Corp',
      threads: 4,
      contacts: ['CEO', 'CTO', 'VP Sales', 'Director'],
      engagement: 67,
    },
    { account: 'TechCo', threads: 3, contacts: ['CEO', 'CFO', 'VP Ops'], engagement: 82 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="text-primary-500" size={20} />
          <CardTitle>Multi-Thread Campaigns</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaigns.map((campaign, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-2">{campaign.account}</h4>
              <div className="flex gap-1 flex-wrap mb-2">
                {campaign.contacts.map(contact => (
                  <Badge key={contact} variant="secondary" className="text-xs">
                    {contact}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{campaign.threads} active threads</span>
                <Badge variant="success">{campaign.engagement}% engaged</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const AccountPlans = () => {
  const plans = [
    {
      account: 'Acme Corp',
      stage: 'Expansion',
      revenue: '$450K',
      nextAction: 'Executive QBR',
      dueDate: 'Jan 15',
    },
    {
      account: 'TechCo',
      stage: 'Nurture',
      revenue: '$280K',
      nextAction: 'Product demo',
      dueDate: 'Jan 8',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="text-primary-500" size={20} />
          <CardTitle>Strategic Account Plans</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {plans.map((plan, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{plan.account}</h4>
                <Badge variant="secondary">{plan.stage}</Badge>
              </div>
              <p className="text-sm mb-2">
                <strong>Revenue:</strong> {plan.revenue}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span>Next: {plan.nextAction}</span>
                <Badge variant="warning" className="text-xs">
                  {plan.dueDate}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const BuyingSignalsDashboard = () => {
  const signals = [
    { account: 'Acme Corp', signal: 'Job posting: Sales Engineer', type: 'hiring', score: 85 },
    { account: 'TechCo', signal: 'Downloaded whitepaper 3x', type: 'content', score: 72 },
    { account: 'StartupXYZ', signal: 'Raised $25M Series B', type: 'funding', score: 95 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <CardTitle>Buying Signals Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {signals.map((signal, idx) => (
            <div key={idx} className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{signal.account}</h4>
                  <p className="text-sm mt-1">{signal.signal}</p>
                </div>
                <Badge variant={signal.score > 80 ? 'success' : 'warning'}>{signal.score}</Badge>
              </div>
              <Badge variant="secondary" className="text-xs">
                {signal.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const StakeholderMapping = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="text-primary-500" size={20} />
          <CardTitle>Stakeholder Org Chart</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <p className="font-semibold">John Doe</p>
            <p className="text-xs">CEO</p>
          </div>
          <div className="grid grid-cols-2 gap-3 ml-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <p className="font-semibold text-sm">Jane Smith</p>
              <p className="text-xs">CTO</p>
              <Badge variant="success" className="text-xs mt-1">
                Champion
              </Badge>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="font-semibold text-sm">Bob Johnson</p>
              <p className="text-xs">CFO</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          Edit Org Chart
        </Button>
      </CardContent>
    </Card>
  );
};

export const AccountAdSync = () => {
  const syncedAccounts = [
    { platform: 'LinkedIn', accounts: 45, spend: '$2,340', impressions: '234K' },
    { platform: 'Google Ads', accounts: 38, spend: '$1,890', impressions: '456K' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Radio className="text-primary-500" size={20} />
          <CardTitle>Account Advertising Sync</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {syncedAccounts.map((sync, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-2">{sync.platform}</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-600">Accounts</p>
                  <p className="font-bold">{sync.accounts}</p>
                </div>
                <div>
                  <p className="text-gray-600">Spend</p>
                  <p className="font-bold">{sync.spend}</p>
                </div>
                <div>
                  <p className="text-gray-600">Impressions</p>
                  <p className="font-bold">{sync.impressions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const TerritoryManagement = () => {
  const territories = [
    { name: 'West Coast', rep: 'Sarah J.', accounts: 45, revenue: '$2.4M', quota: 85 },
    { name: 'East Coast', rep: 'Mike C.', accounts: 38, revenue: '$1.9M', quota: 78 },
    { name: 'Midwest', rep: 'Lisa B.', accounts: 52, revenue: '$2.1M', quota: 92 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="text-primary-500" size={20} />
          <CardTitle>Territory Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {territories.map((territory, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{territory.name}</h4>
                  <p className="text-xs text-gray-600">Rep: {territory.rep}</p>
                </div>
                <Badge
                  variant={
                    territory.quota >= 90 ? 'success' : territory.quota >= 75 ? 'warning' : 'error'
                  }
                >
                  {territory.quota}% to quota
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-sm mt-2">
                <div>
                  <p className="text-gray-600 text-xs">Accounts</p>
                  <p className="font-bold">{territory.accounts}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Revenue</p>
                  <p className="font-bold">{territory.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const AccountHealthScore = () => {
  const accounts = [
    { name: 'Acme Corp', health: 92, trend: 'up', factors: ['High engagement', 'Expansion talks'] },
    { name: 'TechCo', health: 65, trend: 'down', factors: ['Low usage', 'Support tickets'] },
    {
      name: 'StartupXYZ',
      health: 78,
      trend: 'stable',
      factors: ['Steady usage', 'Positive feedback'],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="text-primary-500" size={20} />
          <CardTitle>Account Health Score</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accounts.map((account, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{account.name}</h4>
                <div className="text-right">
                  <Badge
                    variant={
                      account.health > 80 ? 'success' : account.health > 60 ? 'warning' : 'error'
                    }
                  >
                    {account.health}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {account.trend === 'up' ? '↑' : account.trend === 'down' ? '↓' : '→'}{' '}
                    {account.trend}
                  </p>
                </div>
              </div>
              <ul className="text-xs space-y-1">
                {account.factors.map((factor, i) => (
                  <li key={i} className="text-gray-600">
                    • {factor}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

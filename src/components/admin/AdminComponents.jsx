// Admin Components
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Shield, DollarSign, ToggleLeft, Activity } from 'lucide-react';

export const UserActivityDashboard = () => {
  const activities = [
    { user: 'sarah@company.com', action: 'Created campaign', time: '2 min ago' },
    { user: 'mike@company.com', action: 'Exported 500 leads', time: '15 min ago' },
    { user: 'john@company.com', action: 'Updated settings', time: '1 hour ago' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="text-primary-500" size={20} />
          <CardTitle>User Activity Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map((act, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">{act.user}</p>
                <p className="text-xs text-gray-600">{act.action}</p>
              </div>
              <span className="text-xs text-gray-500">{act.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const PermissionMatrix = () => {
  const roles = ['Admin', 'Manager', 'User'];
  const permissions = ['View Leads', 'Create Campaigns', 'Export Data', 'Manage Users'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="text-primary-500" size={20} />
          <CardTitle>Permission Matrix</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Permission</th>
              {roles.map(role => (
                <th key={role} className="p-2 text-center">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, i) => (
              <tr key={perm} className="border-b">
                <td className="p-2">{perm}</td>
                <td className="p-2 text-center">
                  <input type="checkbox" checked readOnly />
                </td>
                <td className="p-2 text-center">
                  <input type="checkbox" checked={i < 3} readOnly />
                </td>
                <td className="p-2 text-center">
                  <input type="checkbox" checked={i < 2} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export const BillingAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="text-primary-500" size={20} />
          <CardTitle>Billing Usage Analytics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-sm text-gray-600">Credits Used</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FeatureFlags = () => {
  const features = [
    { name: 'AI Assistant', enabled: true },
    { name: 'A/B Testing', enabled: true },
    { name: 'Voice Input', enabled: false },
    { name: 'Advanced Analytics', enabled: true },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ToggleLeft className="text-primary-500" size={20} />
          <CardTitle>Feature Flags</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map(feature => (
            <div
              key={feature.name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <span className="font-medium">{feature.name}</span>
              <Badge variant={feature.enabled ? 'success' : 'secondary'}>
                {feature.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

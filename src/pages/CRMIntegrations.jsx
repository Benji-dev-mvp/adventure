import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  Plug,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Activity,
  TrendingUp,
  Clock,
  Settings,
} from 'lucide-react';

const CRMIntegrations = () => {
  const [integrations] = useState([
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'CRM',
      status: 'connected',
      logo: '☁️',
      description: 'Sync leads, contacts, accounts, and opportunities',
      connectedAt: '2024-01-05',
      lastSync: '2 minutes ago',
      syncFrequency: 'Real-time',
      recordsSynced: 12847,
      features: ['Bidirectional Sync', 'Custom Fields', 'Opportunity Tracking', 'Activity Logging'],
      config: {
        syncDirection: 'bidirectional',
        autoCreateContacts: true,
        syncActivities: true,
        defaultOwner: 'Auto-assign',
      },
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      type: 'CRM',
      status: 'connected',
      logo: '🟠',
      description: 'Integrate with HubSpot CRM and Marketing Hub',
      connectedAt: '2024-01-08',
      lastSync: '15 minutes ago',
      syncFrequency: 'Every 15 min',
      recordsSynced: 8392,
      features: ['Contact Sync', 'Deal Pipeline', 'Email Tracking', 'Workflow Integration'],
      config: {
        syncDirection: 'bidirectional',
        syncDeals: true,
        trackEmails: true,
      },
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      type: 'CRM',
      status: 'connected',
      logo: '🟢',
      description: 'Sync deals, contacts, and activities',
      connectedAt: '2023-12-20',
      lastSync: '1 hour ago',
      syncFrequency: 'Every 30 min',
      recordsSynced: 5621,
      features: ['Deal Management', 'Activity Sync', 'Custom Fields', 'Pipeline Stages'],
      config: {
        syncDirection: 'to_crm',
        defaultStage: 'Lead',
        syncNotes: true,
      },
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'Calendar',
      status: 'connected',
      logo: '📅',
      description: 'Automatically book meetings and sync availability',
      connectedAt: '2024-01-10',
      lastSync: 'Real-time',
      syncFrequency: 'Real-time',
      recordsSynced: 247,
      features: ['Meeting Booking', 'Availability Check', 'Auto-create Events', 'Calendar Sync'],
      config: {
        defaultDuration: '30 min',
        bufferTime: '15 min',
        workingHours: '9 AM - 5 PM',
      },
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      type: 'Calendar',
      status: 'connected',
      logo: '📧',
      description: 'Sync calendar and email activities',
      connectedAt: '2024-01-12',
      lastSync: 'Real-time',
      syncFrequency: 'Real-time',
      recordsSynced: 189,
      features: ['Calendar Sync', 'Email Tracking', 'Meeting Scheduling', 'Contact Sync'],
      config: {
        syncEmail: true,
        trackOpens: true,
        syncCalendar: true,
      },
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'Communication',
      status: 'connected',
      logo: '💬',
      description: 'Get notifications and collaborate with team',
      connectedAt: '2024-01-15',
      lastSync: 'Real-time',
      syncFrequency: 'Real-time',
      features: ['Meeting Alerts', 'Lead Notifications', 'Team Updates', 'Reply Alerts'],
      config: {
        channel: '#sales',
        notifications: ['new_lead', 'meeting_booked', 'positive_reply'],
      },
    },
  ]);

  const availableIntegrations = [
    { id: 'zoho', name: 'Zoho CRM', logo: '🔴', type: 'CRM', popular: true },
    { id: 'dynamics', name: 'Microsoft Dynamics', logo: '🔵', type: 'CRM', popular: false },
    { id: 'zendesk', name: 'Zendesk Sell', logo: '🟡', type: 'CRM', popular: false },
    { id: 'zoom', name: 'Zoom', logo: '📹', type: 'Video', popular: true },
    { id: 'teams', name: 'Microsoft Teams', logo: '👥', type: 'Communication', popular: true },
    { id: 'zapier', name: 'Zapier', logo: '⚡', type: 'Automation', popular: true },
  ];

  const syncActivity = [
    {
      integration: 'Salesforce',
      action: 'Created 12 new leads',
      timestamp: '2 minutes ago',
      status: 'success',
    },
    {
      integration: 'HubSpot',
      action: 'Updated 34 contacts',
      timestamp: '15 minutes ago',
      status: 'success',
    },
    {
      integration: 'Google Calendar',
      action: 'Booked 3 meetings',
      timestamp: '1 hour ago',
      status: 'success',
    },
    {
      integration: 'Pipedrive',
      action: 'Sync failed - API rate limit',
      timestamp: '2 hours ago',
      status: 'error',
    },
    {
      integration: 'Salesforce',
      action: 'Updated 8 opportunities',
      timestamp: '3 hours ago',
      status: 'success',
    },
  ];

  const syncStats = {
    totalIntegrations: integrations.filter(i => i.status === 'connected').length,
    totalSynced: integrations.reduce((sum, i) => sum + i.recordsSynced, 0),
    lastSync: '2 minutes ago',
    syncErrors: 3,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            CRM & Calendar Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your favorite tools for seamless data sync
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Plug size={20} className="text-blue-500" />
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-lg font-bold">{syncStats.totalIntegrations}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connected Integrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity size={20} className="text-green-500" />
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-lg font-bold">{syncStats.totalSynced.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Records Synced</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock size={20} className="text-purple-500" />
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <p className="text-lg font-bold">{syncStats.lastSync}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Sync</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle size={20} className="text-red-500" />
                <Badge variant="danger">{syncStats.syncErrors}</Badge>
              </div>
              <p className="text-lg font-bold">{syncStats.syncErrors}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sync Errors</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connected" className="mb-6">
          <TabsList>
            <TabsTrigger value="connected">Connected ({integrations.length})</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="activity">Sync Activity</TabsTrigger>
          </TabsList>

          {/* Connected Integrations */}
          <TabsContent value="connected">
            <div className="grid gap-3">
              {integrations.map(integration => (
                <Card key={integration.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-lg">
                          {integration.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{integration.name}</h3>
                            {integration.status === 'connected' && (
                              <Badge variant="success">
                                <CheckCircle size={12} className="mr-1" />
                                Connected
                              </Badge>
                            )}
                            <Badge variant="outline">{integration.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings size={16} className="mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw size={16} className="mr-2" />
                          Sync Now
                        </Button>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Records Synced</p>
                        <p className="text-lg font-bold">
                          {integration.recordsSynced.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Last Sync</p>
                        <p className="text-lg font-bold">{integration.lastSync}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Frequency</p>
                        <p className="text-lg font-bold">{integration.syncFrequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Connected Since</p>
                        <p className="text-lg font-bold">{integration.connectedAt}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {integration.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            <CheckCircle size={10} className="mr-1" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Configuration Preview */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold mb-2">Configuration</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(integration.config).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-gray-600">
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase())}
                              :
                            </span>
                            <span className="font-semibold">
                              {typeof value === 'boolean'
                                ? value
                                  ? 'Enabled'
                                  : 'Disabled'
                                : Array.isArray(value)
                                  ? value.join(', ')
                                  : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Available Integrations */}
          <TabsContent value="available">
            <div className="grid grid-cols-3 gap-3">
              {availableIntegrations.map(integration => (
                <Card key={integration.id}>
                  <CardContent className="p-4 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center text-4xl mx-auto mb-4">
                      {integration.logo}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{integration.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {integration.type}
                      </Badge>
                      {integration.popular && (
                        <Badge variant="success" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <Button className="w-full">
                      <Plug size={16} className="mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-semibold mb-2">Need a Custom Integration?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We can build custom integrations for your specific needs
                </p>
                <Button variant="outline">Request Integration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Activity */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Sync Activity</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {syncActivity.map((activity, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        activity.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {activity.status === 'success' ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <XCircle size={20} className="text-red-500" />
                          )}
                          <div>
                            <p className="font-semibold text-sm">{activity.integration}</p>
                            <p className="text-xs text-gray-600">{activity.action}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">{activity.timestamp}</p>
                          {activity.status === 'error' && (
                            <Button variant="outline" size="sm" className="mt-1">
                              Retry
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CRMIntegrations;

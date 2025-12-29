// Integration Components - Salesforce, Slack, Calendar, Zapier
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Cloud,
  MessageSquare,
  Calendar,
  Zap,
  ArrowRight,
  Settings,
  Activity,
  Webhook,
} from 'lucide-react';

// WEBHOOK BUILDER
export const WebhookBuilder = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [events, setEvents] = useState(['lead.created', 'lead.updated']);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="text-purple-600" size={20} />
          <CardTitle>Webhook Builder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium mb-2">
              Webhook URL
            </label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.com/webhook"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Events</label>
            <div className="space-y-2">
              {['lead.created', 'lead.updated', 'campaign.sent', 'email.opened'].map(event => (
                <label
                  key={event}
                  className="flex items-center gap-2"
                  aria-label={`Toggle ${event} event`}
                >
                  <input
                    type="checkbox"
                    checked={events.includes(event)}
                    onChange={e => {
                      if (e.target.checked) {
                        setEvents([...events, event]);
                      } else {
                        setEvents(events.filter(e => e !== event));
                      }
                    }}
                    className="rounded"
                    aria-label={event}
                  />
                  <span className="text-sm">{event}</span>
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full">Create Webhook</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// TWO-WAY SALESFORCE SYNC
export const TwoWaySalesforceSync = () => {
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSync, setLastSync] = useState('2 minutes ago');

  const syncStats = {
    leadsInSync: 3847,
    dealsInSync: 284,
    activitiesInSync: 12847,
    conflicts: 3,
  };

  const recentSyncs = [
    {
      object: 'Lead',
      name: 'John Doe @ Acme Corp',
      action: 'Updated',
      status: 'success',
      time: '30 sec ago',
    },
    {
      object: 'Opportunity',
      name: 'Enterprise Deal - $50K',
      action: 'Created',
      status: 'success',
      time: '1 min ago',
    },
    {
      object: 'Activity',
      name: 'Email sent to Sarah',
      action: 'Logged',
      status: 'success',
      time: '2 min ago',
    },
    {
      object: 'Lead',
      name: 'Mike Johnson @ TechStart',
      action: 'Updated',
      status: 'conflict',
      time: '3 min ago',
    },
  ];

  const fieldMappings = [
    { artisan: 'Lead Name', salesforce: 'Name', status: 'mapped' },
    { artisan: 'Company', salesforce: 'Account.Name', status: 'mapped' },
    { artisan: 'Email', salesforce: 'Email', status: 'mapped' },
    { artisan: 'Lead Score', salesforce: 'Lead_Score__c', status: 'mapped' },
    { artisan: 'Campaign', salesforce: 'Campaign.Name', status: 'unmapped' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="text-blue-600" size={20} />
            <CardTitle>Salesforce 2-Way Sync</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={syncStatus === 'synced' ? 'success' : 'warning'}>
              {syncStatus === 'synced' ? 'Synced' : 'Syncing...'}
            </Badge>
            <Button
              size="sm"
              onClick={() => {
                setSyncStatus('syncing');
                setTimeout(() => {
                  setSyncStatus('synced');
                  setLastSync('Just now');
                }, 2000);
              }}
            >
              <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Last sync: {lastSync}</p>
      </CardHeader>
      <CardContent>
        {/* Sync Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-lg font-bold text-blue-600">
              {syncStats.leadsInSync.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Leads in Sync</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{syncStats.dealsInSync}</p>
            <p className="text-xs text-gray-600">Opportunities</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-lg font-bold text-purple-600">
              {syncStats.activitiesInSync.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Activities</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <p className="text-lg font-bold text-orange-600">{syncStats.conflicts}</p>
            <p className="text-xs text-gray-600">Conflicts</p>
          </div>
        </div>

        {/* Recent Syncs */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2 max-h-48 overflow-auto">
            {recentSyncs.map((sync, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {sync.status === 'success' ? (
                    <CheckCircle className="text-green-600" size={16} />
                  ) : (
                    <AlertTriangle className="text-orange-600" size={16} />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{sync.name}</p>
                    <p className="text-xs text-gray-600">
                      {sync.object} • {sync.action}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{sync.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Field Mappings */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Field Mappings</h3>
          <div className="space-y-2">
            {fieldMappings.map((mapping, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
              >
                <Badge variant="secondary" className="text-xs">
                  {mapping.artisan}
                </Badge>
                <ArrowRight size={14} className="text-gray-400" />
                <Badge variant="secondary" className="text-xs">
                  {mapping.salesforce}
                </Badge>
                {mapping.status === 'mapped' ? (
                  <CheckCircle className="text-green-600 ml-auto" size={14} />
                ) : (
                  <AlertTriangle className="text-orange-600 ml-auto" size={14} />
                )}
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline" className="w-full mt-3">
            <Settings size={14} /> Configure Mappings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// SLACK DEEP INTEGRATION
export const SlackTeamsDeepIntegration = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      channel: '#sales',
      message: 'Hot lead detected: John Doe @ Acme Corp (Score: 94)',
      time: '2 min ago',
      actions: true,
    },
    {
      id: 2,
      channel: '#team',
      message: 'Campaign "Q4 Outbound" needs approval',
      time: '15 min ago',
      actions: true,
    },
    {
      id: 3,
      channel: '#wins',
      message: 'Deal closed! $50K from TechStart Inc',
      time: '1 hour ago',
      actions: false,
    },
  ]);

  const slackCommands = [
    { command: '/ava start', description: 'Start a new campaign' },
    { command: '/ava stats', description: "Get today's performance stats" },
    { command: '/ava leads', description: 'Show hot leads' },
    { command: '/ava approve', description: 'Approve pending campaign' },
    { command: '/ava pause [campaign]', description: 'Pause a running campaign' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-purple-600" size={20} />
            <CardTitle>Slack Deep Integration</CardTitle>
          </div>
          <Badge variant="success">Connected</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Control Artisan from Slack</p>
      </CardHeader>
      <CardContent>
        {/* Recent Notifications */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Recent Slack Notifications</h3>
          <div className="space-y-3">
            {notifications.map(notif => (
              <div key={notif.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs mb-2">
                      {notif.channel}
                    </Badge>
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
                {notif.actions && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      View in Artisan
                    </Button>
                    <Button size="sm">Take Action</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slack Commands */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Available Slash Commands</h3>
          <div className="space-y-2">
            {slackCommands.map((cmd, idx) => (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <code className="text-sm text-purple-600 font-mono">{cmd.command}</code>
                <p className="text-xs text-gray-600 mt-1">{cmd.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Notification Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Hot lead detected (Score &gt; 90)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Campaign needs approval</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Deal closed / Won</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Daily performance summary</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// CALENDAR AUTO-SCHEDULER
export const CalendarAutoScheduler = () => {
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(true);
  const [recentSchedules, setRecentSchedules] = useState([
    {
      prospect: 'John Doe',
      company: 'Acme Corp',
      time: 'Tomorrow 10:00 AM PST',
      status: 'scheduled',
      type: 'auto',
    },
    {
      prospect: 'Sarah Smith',
      company: 'TechStart',
      time: 'Dec 29 2:00 PM EST',
      status: 'scheduled',
      type: 'auto',
    },
    {
      prospect: 'Mike Johnson',
      company: 'DataCo',
      time: 'Dec 30 11:00 AM CST',
      status: 'pending',
      type: 'manual',
    },
  ]);

  const schedulingRules = [
    { rule: 'Only schedule between 9 AM - 5 PM', enabled: true },
    { rule: "Respect prospect's timezone", enabled: true },
    { rule: 'Min 15 min buffer between meetings', enabled: true },
    { rule: 'Block Friday afternoons', enabled: false },
    { rule: 'Prefer morning slots', enabled: true },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-green-600" size={20} />
            <CardTitle>Calendar Auto-Scheduler</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Auto-schedule</span>
            <label className="relative inline-block w-10 h-5">
              <input
                type="checkbox"
                checked={autoScheduleEnabled}
                onChange={() => setAutoScheduleEnabled(!autoScheduleEnabled)}
                className="opacity-0 w-0 h-0"
              />
              <span
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all ${
                  autoScheduleEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute h-4 w-4 left-0.5 bottom-0.5 bg-white rounded-full transition-all ${
                    autoScheduleEnabled ? 'transform translate-x-5' : ''
                  }`}
                ></span>
              </span>
            </label>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Automatically schedule meetings from positive replies
        </p>
      </CardHeader>
      <CardContent>
        {/* Recent Scheduled Meetings */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Recently Scheduled</h3>
          <div className="space-y-2">
            {recentSchedules.map((schedule, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-sm">{schedule.prospect}</p>
                  <p className="text-xs text-gray-600">
                    {schedule.company} • {schedule.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {schedule.type === 'auto' && (
                    <Badge variant="success" className="text-xs">
                      Auto-scheduled
                    </Badge>
                  )}
                  {schedule.status === 'scheduled' ? (
                    <CheckCircle className="text-green-600" size={16} />
                  ) : (
                    <AlertTriangle className="text-orange-600" size={16} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduling Rules */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Scheduling Rules</h3>
          <div className="space-y-2">
            {schedulingRules.map((rule, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded"
              >
                <input type="checkbox" checked={rule.enabled} className="rounded" />
                <span className="text-sm">{rule.rule}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Settings */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Your Availability</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="calendar-timezone" className="text-xs text-gray-600 mb-1 block">
                Timezone
              </label>
              <select id="calendar-timezone" className="w-full text-sm border rounded p-2">
                <option>Pacific Time (PST)</option>
                <option>Eastern Time (EST)</option>
                <option>Central Time (CST)</option>
              </select>
            </div>
            <div>
              <label htmlFor="calendar-duration" className="text-xs text-gray-600 mb-1 block">
                Default Duration
              </label>
              <select id="calendar-duration" className="w-full text-sm border rounded p-2">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
          </div>
          <Button className="w-full mt-3">Sync Google Calendar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ZAPIER ACTION BUILDER
export const ZapierActionBuilder = () => {
  const [zapiers, setZapiers] = useState([
    {
      id: 1,
      name: 'New Lead → Add to Google Sheets',
      trigger: 'Lead Created',
      action: 'Add Row',
      enabled: true,
      runs: 847,
    },
    {
      id: 2,
      name: 'Hot Lead → Send Slack Alert',
      trigger: 'Lead Score > 90',
      action: 'Send Message',
      enabled: true,
      runs: 34,
    },
    {
      id: 3,
      name: 'Deal Won → Update Airtable',
      trigger: 'Deal Closed Won',
      action: 'Update Record',
      enabled: false,
      runs: 12,
    },
  ]);

  const availableTriggers = [
    'Lead Created',
    'Lead Score Updated',
    'Campaign Sent',
    'Email Opened',
    'Email Replied',
    'Meeting Booked',
    'Deal Closed',
    'Hot Lead Detected',
  ];

  const popularActions = [
    { app: 'Google Sheets', icon: '📊', action: 'Add row' },
    { app: 'Slack', icon: '💬', action: 'Send message' },
    { app: 'Airtable', icon: '🗂️', action: 'Create record' },
    { app: 'HubSpot', icon: '🎯', action: 'Update contact' },
    { app: 'Gmail', icon: '📧', action: 'Send email' },
    { app: 'Trello', icon: '📋', action: 'Create card' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-orange-600" size={20} />
            <CardTitle>Zapier Actions</CardTitle>
          </div>
          <Button size="sm">Create New Zap</Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Trigger any action on 5000+ apps</p>
      </CardHeader>
      <CardContent>
        {/* Active Zaps */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Active Zaps</h3>
          <div className="space-y-2">
            {zapiers.map(zap => (
              <div key={zap.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{zap.name}</p>
                    <Badge variant={zap.enabled ? 'success' : 'secondary'} className="text-xs">
                      {zap.enabled ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {zap.trigger} → {zap.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{zap.runs} runs this month</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={zap.enabled ? 'danger' : 'default'}
                    onClick={() => {
                      setZapiers(
                        zapiers.map(z => (z.id === zap.id ? { ...z, enabled: !z.enabled } : z))
                      );
                    }}
                  >
                    {zap.enabled ? 'Pause' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Actions */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Popular Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {popularActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer text-center"
              >
                <span className="text-lg mb-2 block">{action.icon}</span>
                <p className="text-sm font-semibold">{action.app}</p>
                <p className="text-xs text-gray-600">{action.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create New */}
        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Create New Zap</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="zapier-trigger" className="text-xs text-gray-600 mb-1 block">
                When this happens...
              </label>
              <select id="zapier-trigger" className="w-full text-sm border rounded p-2">
                <option>Select trigger</option>
                {availableTriggers.map((trigger, idx) => (
                  <option key={idx}>{trigger}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="zapier-action" className="text-xs text-gray-600 mb-1 block">
                Do this...
              </label>
              <select id="zapier-action" className="w-full text-sm border rounded p-2">
                <option>Select action app</option>
                {popularActions.map((action, idx) => (
                  <option key={idx}>
                    {action.app} - {action.action}
                  </option>
                ))}
              </select>
            </div>
            <Button className="w-full">Create Zap</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Legacy components (kept for backward compatibility)
export const CalendarSync = () => {
  const calendars = [
    { name: 'Google Calendar', connected: true, icon: '📅' },
    { name: 'Outlook Calendar', connected: false, icon: '📆' },
    { name: 'Apple Calendar', connected: false, icon: '🍎' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="text-primary-500" size={20} />
          <CardTitle>Calendar Sync</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {calendars.map(cal => (
            <div key={cal.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{cal.icon}</span>
                <span className="font-medium">{cal.name}</span>
              </div>
              {cal.connected ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <Button size="sm" variant="outline">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const IntegrationHealth = () => {
  const integrations = [
    { name: 'Salesforce', status: 'healthy', lastSync: '2 min ago', errors: 0 },
    { name: 'HubSpot', status: 'warning', lastSync: '1 hour ago', errors: 2 },
    { name: 'Slack', status: 'healthy', lastSync: '5 min ago', errors: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="text-primary-500" size={20} />
          <CardTitle>Integration Health Monitor</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map(int => (
            <div key={int.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold">{int.name}</h4>
                <p className="text-sm text-gray-600">Last sync: {int.lastSync}</p>
              </div>
              <div className="text-right">
                <Badge variant={int.status === 'healthy' ? 'success' : 'warning'}>
                  {int.status}
                </Badge>
                {int.errors > 0 && <p className="text-xs text-red-600 mt-1">{int.errors} errors</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

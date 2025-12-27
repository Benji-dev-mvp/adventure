// Automation & Workflow Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { GitBranch, Users, Zap, Webhook, Calendar, Repeat, CheckSquare, Database } from 'lucide-react';

export const VisualWorkflowBuilder = () => {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'trigger', label: 'Lead Created', x: 50, y: 50 },
    { id: 2, type: 'condition', label: 'Score > 70?', x: 50, y: 150 },
    { id: 3, type: 'action', label: 'Assign to Sales', x: 150, y: 250 },
    { id: 4, type: 'action', label: 'Add to Nurture', x: -50, y: 250 }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="text-primary-500" size={20} />
          <CardTitle>Visual Workflow Builder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-4 min-h-[300px] bg-gray-50 dark:bg-white/5 relative">
          {/* Canvas */}
          {nodes.map(node => (
            <div 
              key={node.id}
              className={`absolute p-3 rounded-lg border-2 cursor-move ${
                node.type === 'trigger' ? 'bg-green-100 border-green-500' :
                node.type === 'condition' ? 'bg-yellow-100 border-yellow-500' :
                'bg-blue-100 border-blue-500'
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}px` }}
            >
              <p className="text-sm font-medium">{node.label}</p>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 mt-4 flex-wrap">
          <Button size="sm" variant="outline">+ Trigger</Button>
          <Button size="sm" variant="outline">+ Condition</Button>
          <Button size="sm" variant="outline">+ Action</Button>
          <Button size="sm" variant="outline">+ Delay</Button>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1">Save Workflow</Button>
          <Button variant="outline">Test Run</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const LeadRoutingEngine = () => {
  const [rules, setRules] = useState([
    { id: 1, name: 'Enterprise Accounts', condition: 'Company Size > 1000', assignTo: 'Enterprise Team', active: true },
    { id: 2, name: 'West Coast Leads', condition: 'Location: CA, OR, WA', assignTo: 'Sarah Johnson', active: true },
    { id: 3, name: 'Tech Industry', condition: 'Industry: Technology', assignTo: 'Mike Chen', active: false }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="text-primary-500" size={20} />
          <CardTitle>Lead Routing Engine</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rules.map(rule => (
            <div key={rule.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{rule.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{rule.condition}</p>
                </div>
                <Badge variant={rule.active ? 'success' : 'secondary'}>
                  {rule.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Assign to:</span>
                <span className="font-medium text-primary-600">{rule.assignTo}</span>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Add Routing Rule</Button>
      </CardContent>
    </Card>
  );
};

export const TriggerBasedActions = () => {
  const triggers = [
    { name: 'Lead Score Changes', actions: 3, lastTriggered: '2 min ago', status: 'active' },
    { name: 'No Reply After 3 Days', actions: 2, lastTriggered: '15 min ago', status: 'active' },
    { name: 'Email Opened 3+ Times', actions: 1, lastTriggered: '1 hour ago', status: 'active' },
    { name: 'Meeting Booked', actions: 4, lastTriggered: 'Never', status: 'inactive' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="text-primary-500" size={20} />
          <CardTitle>Trigger-Based Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {triggers.map((trigger, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">{trigger.name}</h4>
                <Badge variant={trigger.status === 'active' ? 'success' : 'secondary'}>
                  {trigger.status}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{trigger.actions} actions configured</span>
                <span>Last: {trigger.lastTriggered}</span>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create New Trigger</Button>
      </CardContent>
    </Card>
  );
};

export const WebhookAutomationStudio = () => {
  const [webhooks, setWebhooks] = useState([
    { name: 'Slack Notification', endpoint: 'https://hooks.slack.com/...', events: ['lead_created', 'deal_won'], status: 'healthy' },
    { name: 'CRM Sync', endpoint: 'https://api.crm.com/webhook', events: ['lead_updated'], status: 'healthy' },
    { name: 'Analytics Tracker', endpoint: 'https://analytics.com/track', events: ['email_opened'], status: 'error' }
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="text-primary-500" size={20} />
          <CardTitle>Webhook Automation Studio</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {webhooks.map((wh, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">{wh.name}</h4>
                <Badge variant={wh.status === 'healthy' ? 'success' : 'error'}>
                  {wh.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 font-mono mb-2 truncate">{wh.endpoint}</p>
              <div className="flex gap-1 flex-wrap">
                {wh.events.map(evt => (
                  <Badge key={evt} variant="secondary" className="text-xs">{evt}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Configure Webhook</Button>
      </CardContent>
    </Card>
  );
};

export const ScheduledReports = () => {
  const reports = [
    { name: 'Weekly Performance', recipients: 'team@company.com', schedule: 'Mon 9:00 AM', nextRun: 'in 2 days' },
    { name: 'Monthly Executive Summary', recipients: 'exec@company.com', schedule: '1st of month', nextRun: 'in 5 days' },
    { name: 'Daily Lead Report', recipients: 'sales@company.com', schedule: 'Daily 8:00 AM', nextRun: 'in 14 hours' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="text-primary-500" size={20} />
          <CardTitle>Scheduled Reports</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">{report.name}</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>To: {report.recipients}</span>
                </div>
                <div className="flex justify-between">
                  <span>Schedule: {report.schedule}</span>
                  <Badge variant="secondary" className="text-xs">{report.nextRun}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create Report Schedule</Button>
      </CardContent>
    </Card>
  );
};

export const AutoFollowUpSequences = () => {
  const sequences = [
    { name: 'Cold Outreach Sequence', steps: 5, active: 124, completed: 45, avgResponseTime: '2.3 days' },
    { name: 'Demo Follow-up', steps: 3, active: 34, completed: 78, avgResponseTime: '1.1 days' },
    { name: 'Re-engagement Campaign', steps: 4, active: 67, completed: 23, avgResponseTime: '4.2 days' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Repeat className="text-primary-500" size={20} />
          <CardTitle>Auto-Follow-Up Sequences</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sequences.map((seq, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <h4 className="font-semibold mb-3">{seq.name}</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Steps</p>
                  <p className="font-bold">{seq.steps}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Active</p>
                  <p className="font-bold text-blue-600">{seq.active}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Done</p>
                  <p className="font-bold text-green-600">{seq.completed}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Avg Time</p>
                  <p className="font-bold">{seq.avgResponseTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create Sequence</Button>
      </CardContent>
    </Card>
  );
};

export const TaskAutomation = () => {
  const automations = [
    { trigger: 'Lead reaches SQL stage', action: 'Create task: Schedule demo', enabled: true },
    { trigger: 'No activity in 7 days', action: 'Create task: Follow up call', enabled: true },
    { trigger: 'Contract sent', action: 'Create task: Check-in after 48h', enabled: false }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckSquare className="text-primary-500" size={20} />
          <CardTitle>Task Automation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {automations.map((auto, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">When: {auto.trigger}</p>
                  <p className="text-sm text-primary-600">Then: {auto.action}</p>
                </div>
                <Badge variant={auto.enabled ? 'success' : 'secondary'}>
                  {auto.enabled ? 'ON' : 'OFF'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Add Automation</Button>
      </CardContent>
    </Card>
  );
};

export const DataSyncScheduler = () => {
  const syncs = [
    { source: 'Salesforce', direction: 'Bi-directional', schedule: 'Every 15 min', lastSync: '3 min ago', status: 'success' },
    { source: 'HubSpot', direction: 'Pull only', schedule: 'Hourly', lastSync: '42 min ago', status: 'success' },
    { source: 'Google Sheets', direction: 'Push only', schedule: 'Daily 2 AM', lastSync: '18 hours ago', status: 'warning' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="text-primary-500" size={20} />
          <CardTitle>Data Sync Scheduler</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {syncs.map((sync, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{sync.source}</h4>
                  <p className="text-xs text-gray-600">{sync.direction}</p>
                </div>
                <Badge variant={sync.status === 'success' ? 'success' : 'warning'}>
                  {sync.status}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>{sync.schedule}</span>
                <span>Last: {sync.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Configure Sync</Button>
      </CardContent>
    </Card>
  );
};

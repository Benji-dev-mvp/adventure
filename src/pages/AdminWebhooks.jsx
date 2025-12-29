import React, { useState } from 'react';
import { Plus, Globe, Zap, AlertCircle, X, Calendar, Activity } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/Toast';

const AdminWebhooks = () => {
  const toast = useToast();
  const [webhooks, setWebhooks] = useState([
    {
      id: '1',
      url: 'https://your-app.com/webhooks/artisan',
      events: ['campaign.sent', 'lead.replied', 'meeting.booked'],
      status: 'active',
      created: '2024-12-01',
      lastTriggered: '2 hours ago',
      deliveries: 1547,
      failures: 3,
    },
    {
      id: '2',
      url: 'https://zapier.com/hooks/catch/123456/',
      events: ['lead.created', 'campaign.completed'],
      status: 'active',
      created: '2024-11-20',
      lastTriggered: '1 day ago',
      deliveries: 892,
      failures: 0,
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [],
    secret: '',
  });

  const availableEvents = [
    {
      id: 'campaign.sent',
      label: 'Campaign Sent',
      description: 'Triggered when a campaign is sent',
    },
    {
      id: 'campaign.completed',
      label: 'Campaign Completed',
      description: 'Triggered when a campaign completes',
    },
    {
      id: 'lead.created',
      label: 'Lead Created',
      description: 'Triggered when a new lead is added',
    },
    {
      id: 'lead.replied',
      label: 'Lead Replied',
      description: 'Triggered when a lead replies to an email',
    },
    {
      id: 'meeting.booked',
      label: 'Meeting Booked',
      description: 'Triggered when a meeting is scheduled',
    },
    {
      id: 'lead.unsubscribed',
      label: 'Lead Unsubscribed',
      description: 'Triggered when a lead opts out',
    },
  ];

  const createWebhook = () => {
    if (!newWebhook.url.trim()) {
      toast.error('Please enter a webhook URL');
      return;
    }
    if (!newWebhook.url.startsWith('https://')) {
      toast.error('Webhook URL must use HTTPS');
      return;
    }
    if (newWebhook.events.length === 0) {
      toast.error('Please select at least one event');
      return;
    }

    const webhook = {
      id: Date.now().toString(),
      url: newWebhook.url,
      events: newWebhook.events,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      lastTriggered: 'Never',
      deliveries: 0,
      failures: 0,
    };

    setWebhooks([...webhooks, webhook]);
    setShowCreateModal(false);
    setNewWebhook({ url: '', events: [], secret: '' });
    toast.success('Webhook created successfully');
  };

  const deleteWebhook = id => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      setWebhooks(webhooks.filter(w => w.id !== id));
      toast.success('Webhook deleted');
    }
  };

  const toggleEvent = eventId => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  const testWebhook = webhook => {
    toast.info(`Sending test payload to ${webhook.url}...`);
    // Simulate test
    setTimeout(() => {
      toast.success('Test payload sent successfully!');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Webhooks</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure webhooks to receive real-time event notifications
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Webhook
            </button>
          </div>
        </div>

        {/* Webhooks List */}
        <div className="space-y-3">
          {webhooks.map(webhook => (
            <div
              key={webhook.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {webhook.url}
                    </code>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 ml-8">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {webhook.created}
                    </span>
                    <span>•</span>
                    <span>Last triggered {webhook.lastTriggered}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      webhook.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {webhook.status}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 ml-8">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Deliveries</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {webhook.deliveries.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Failures</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {webhook.failures}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(((webhook.deliveries - webhook.failures) / webhook.deliveries) * 100).toFixed(
                      1
                    )}
                    %
                  </p>
                </div>
              </div>

              {/* Events */}
              <div className="ml-8 mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subscribed Events:
                </p>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map(event => (
                    <span
                      key={event}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-8">
                <button
                  onClick={() => testWebhook(webhook)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Zap className="w-4 h-4 inline mr-1" />
                  Test Webhook
                </button>
                <button
                  onClick={() => {
                    /* View delivery logs */
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Activity className="w-4 h-4 inline mr-1" />
                  View Logs
                </button>
                <button
                  onClick={() => deleteWebhook(webhook.id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full p-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Webhook
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={e => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://your-app.com/webhooks/artisan"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must use HTTPS for security
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subscribe to Events
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableEvents.map(event => (
                      <label
                        key={event.id}
                        className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event.id)}
                          onChange={() => toggleEvent(event.id)}
                          className="mt-1 w-4 h-4 text-primary-600 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {event.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Webhook Security
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        Each webhook request includes a signature in the `X-Artisan-Signature`
                        header that you should verify. See documentation for details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createWebhook}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Create Webhook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Webhook Payload Example
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">
            Here's what a webhook payload looks like:
          </p>
          <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <pre className="text-blue-900 dark:text-blue-300">
              {`{
  "event": "lead.replied",
  "timestamp": "2024-12-27T20:45:00Z",
  "data": {
    "lead_id": "lead_123",
    "lead_name": "Sarah Chen",
    "campaign_id": "camp_456",
    "reply_content": "Thanks for reaching out..."
  }
}`}
            </pre>
          </div>
          <a
            href="/docs/webhooks"
            className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View Webhook Documentation →
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminWebhooks;

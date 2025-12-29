import React, { useState } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Calendar, Check, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/Toast';

const AdminAPIKeys = () => {
  const toast = useToast();
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_live_51HaC9KGH7Z5kN8Y2xQZr...',
      created: '2024-12-01',
      lastUsed: '2 hours ago',
      permissions: ['read', 'write'],
      requests: 15847,
      status: 'active',
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'sk_test_51HaC9KGH7Z5kN8Y2xQZr...',
      created: '2024-11-15',
      lastUsed: '1 day ago',
      permissions: ['read'],
      requests: 3421,
      status: 'active',
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: [],
  });

  const toggleKeyVisibility = id => {
    setRevealedKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyToClipboard = key => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const createAPIKey = () => {
    if (!newKeyForm.name.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    if (newKeyForm.permissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    const newKey = {
      id: Date.now().toString(),
      name: newKeyForm.name,
      key: `sk_live_${Math.random().toString(36).substring(2, 30)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      permissions: newKeyForm.permissions,
      requests: 0,
      status: 'active',
    };

    setApiKeys([...apiKeys, newKey]);
    setShowCreateModal(false);
    setNewKeyForm({ name: '', permissions: [] });
    toast.success('API key created successfully');
  };

  const deleteAPIKey = id => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
      toast.success('API key deleted');
    }
  };

  const togglePermission = permission => {
    setNewKeyForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your API keys for programmatic access
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Key
            </button>
          </div>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map(apiKey => (
            <div
              key={apiKey.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {apiKey.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {apiKey.created}
                    </span>
                    <span>•</span>
                    <span>Last used {apiKey.lastUsed}</span>
                    <span>•</span>
                    <span>{apiKey.requests.toLocaleString()} requests</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    Active
                  </span>
                  <button
                    onClick={() => deleteAPIKey(apiKey.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* API Key Display */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between gap-4">
                  <code className="flex-1 text-sm font-mono text-gray-700 dark:text-gray-300">
                    {revealedKeys.has(apiKey.id) ? apiKey.key : '••••••••••••••••••••••••••••'}
                  </code>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {revealedKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map(permission => (
                    <span
                      key={permission}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-lg w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create New API Key
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyForm.name}
                    onChange={e => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                    placeholder="Production API Key"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['read', 'write', 'delete', 'admin'].map(perm => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKeyForm.permissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {perm}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                        Important Security Notice
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        Make sure to copy your API key now. You won't be able to see it again after
                        creating it.
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
                  onClick={createAPIKey}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Getting Started with the API
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">
            Use your API keys to authenticate requests to the Artisan API.
          </p>
          <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-4 font-mono text-sm">
            <code className="text-blue-900 dark:text-blue-300">
              curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
              &nbsp;&nbsp;https://api.artisan.co/v1/campaigns
            </code>
          </div>
          <a
            href="/docs/api"
            className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View API Documentation →
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAPIKeys;

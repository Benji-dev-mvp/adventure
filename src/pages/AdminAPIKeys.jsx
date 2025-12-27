import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Calendar, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/Toast';
import { listAPIKeys, createAPIKey, revokeAPIKey, rotateAPIKey } from '../lib/dataService';

const AdminAPIKeys = () => {
  const toast = useToast();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: []
  });
  const [createdKey, setCreatedKey] = useState(null);

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    setLoading(true);
    try {
      const keys = await listAPIKeys();
      setApiKeys(keys);
    } catch (error) {
      toast.error('Failed to load API keys');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (id) => {
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

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const createAPIKeyHandler = async () => {
    if (!newKeyForm.name.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    if (newKeyForm.permissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    try {
      const result = await createAPIKey({
        name: newKeyForm.name,
        permissions: newKeyForm.permissions,
        rate_limit: 1000
      });
      
      // Show the newly created key
      setCreatedKey(result);
      setNewKeyForm({ name: '', permissions: [] });
      toast.success('API key created successfully');
      
      // Reload the list
      await loadAPIKeys();
    } catch (error) {
      toast.error('Failed to create API key');
      console.error(error);
    }
  };

  const closeCreatedKeyModal = () => {
    setCreatedKey(null);
    setShowCreateModal(false);
  };

  const deleteAPIKey = async (id) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      try {
        await revokeAPIKey(id, 'Manually revoked by user');
        toast.success('API key revoked');
        await loadAPIKeys();
      } catch (error) {
        toast.error('Failed to revoke API key');
        console.error(error);
      }
    }
  };

  const rotateAPIKeyHandler = async (id) => {
    if (confirm('This will create a new key and revoke the old one. Continue?')) {
      try {
        const result = await rotateAPIKey(id);
        setCreatedKey(result);
        toast.success('API key rotated successfully');
        await loadAPIKeys();
      } catch (error) {
        toast.error('Failed to rotate API key');
        console.error(error);
      }
    }
  };

  const togglePermission = (permission) => {
    setNewKeyForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading API keys...</p>
          </div>
        )}

        {/* API Keys List */}
        {!loading && (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
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
                        Created {new Date(apiKey.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Last used {apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleString() : 'Never'}</span>
                      <span>•</span>
                      <span>{apiKey.request_count.toLocaleString()} requests</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      apiKey.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {apiKey.status}
                    </span>
                    <button
                      onClick={() => rotateAPIKeyHandler(apiKey.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Rotate key"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
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
                      {apiKey.key_prefix}••••••••••••••••••••
                    </code>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(apiKey.key_prefix)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((permission) => (
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

            {apiKeys.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Key className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No API keys created yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create your first API key →
                </button>
              </div>
            )}
          </div>
        )}

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
                    onChange={(e) => setNewKeyForm({...newKeyForm, name: e.target.value})}
                    placeholder="Production API Key"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['read', 'write', 'delete', 'admin'].map((perm) => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKeyForm.permissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{perm}</span>
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
                        Make sure to copy your API key now. You won't be able to see it again after creating it.
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
                  onClick={createAPIKeyHandler}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Created Key Modal - Show key once */}
        {createdKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-lg w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <Check className="inline w-6 h-6 text-green-600 mr-2" />
                API Key Created Successfully
              </h2>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                      Save This Key Now!
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      This is the only time you'll be able to see the full API key. Make sure to copy it now.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your API Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 break-all">
                    {createdKey.key}
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdKey.key)}
                    className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <p><strong>Name:</strong> {createdKey.name}</p>
                <p><strong>Permissions:</strong> {createdKey.permissions.join(', ')}</p>
                <p><strong>Created:</strong> {new Date(createdKey.created_at).toLocaleString()}</p>
              </div>

              <button
                onClick={closeCreatedKeyModal}
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                I've Saved This Key
              </button>
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

/**
 * Example: AdminAPIKeys with new architecture
 * 
 * This file demonstrates how to use the new centralized API layer and hooks
 * to replace ad-hoc API calls in admin pages.
 * 
 * To use this in production:
 * 1. Replace the mock data in AdminAPIKeys.jsx with this implementation
 * 2. Ensure backend API endpoints match the AdminApi module
 * 3. Set up TenantContext with actual tenant selection UI
 */

import React, { useState } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Calendar, Check, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAdminApiKeys } from '../hooks/useAdminApiKeys';
import { useTenant } from '../contexts/TenantContext';
import { PageLoader, InlineLoader } from '../components/Loading';

const AdminAPIKeysExample = () => {
  // Use the centralized hook instead of local state + fetch
  const { keys, loading, isCreating, isRevoking, createApiKey, revokeApiKey } = useAdminApiKeys();
  const { tenantId } = useTenant();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: []
  });

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
    // Toast is automatically shown by the hook
  };

  const handleCreateAPIKey = async () => {
    if (!newKeyForm.name.trim()) {
      // Validation handled by hook with toast
      return;
    }
    
    const result = await createApiKey({
      name: newKeyForm.name,
      permissions: newKeyForm.permissions,
    });
    
    if (result) {
      setShowCreateModal(false);
      setNewKeyForm({ name: '', permissions: [] });
      // Success toast automatically shown by hook
    }
  };

  const handleDeleteAPIKey = async (keyId) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      await revokeApiKey(keyId);
      // Success/error toast automatically shown by hook
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

  // Show loading state while fetching
  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader message="Loading API keys..." />
      </DashboardLayout>
    );
  }

  // Show message if no tenant selected
  if (!tenantId) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-6xl">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              Please select a workspace to manage API keys.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {isCreating ? (
                <InlineLoader />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create New Key
                </>
              )}
            </button>
          </div>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {keys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No API keys yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-primary-600 hover:text-primary-700"
              >
                Create your first API key
              </button>
            </div>
          ) : (
            keys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {apiKey.name}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        {apiKey.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-sm bg-gray-100 dark:bg-slate-900 px-3 py-1 rounded">
                        {revealedKeys.has(apiKey.id) ? apiKey.key : '••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                      >
                        {revealedKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                      >
                        <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {apiKey.created}
                      </div>
                      <div>Last used: {apiKey.lastUsed}</div>
                      <div>{apiKey.requests?.toLocaleString() || 0} requests</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAPIKey(apiKey.id)}
                    disabled={isRevoking}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Create New API Key
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyForm.name}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-900 dark:text-white"
                    placeholder="Production API Key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['read', 'write', 'delete'].map((permission) => (
                      <label key={permission} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newKeyForm.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAPIKey}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg"
                >
                  {isCreating ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAPIKeysExample;

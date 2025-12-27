/**
 * Admin API Keys Hook
 * Manages API keys for a tenant with CRUD operations
 */
import { useState, useCallback } from 'react';
import { useApiQuery } from './useSimpleApiQuery';
import { AdminApi } from '../lib/adminApi';
import { useTenant } from '../contexts/TenantContext';
import { useToast } from '../components/Toast';

export function useAdminApiKeys() {
  const { tenantId } = useTenant();
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // Fetch API keys
  const { data, loading, error, refetch } = useApiQuery(
    () => AdminApi.listApiKeys(tenantId),
    [tenantId]
  );

  // Create new API key
  const createApiKey = useCallback(
    async (payload) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return null;
      }

      setIsCreating(true);
      try {
        const response = await AdminApi.createApiKey(tenantId, payload);
        toast.success('API key created successfully');
        refetch(); // Refresh the list
        return response.data;
      } catch (err) {
        toast.error('Failed to create API key');
        console.error('Create API key error:', err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [tenantId, refetch, toast]
  );

  // Revoke API key
  const revokeApiKey = useCallback(
    async (keyId) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      setIsRevoking(true);
      try {
        await AdminApi.revokeApiKey(tenantId, keyId);
        toast.success('API key revoked successfully');
        refetch(); // Refresh the list
        return true;
      } catch (err) {
        toast.error('Failed to revoke API key');
        console.error('Revoke API key error:', err);
        return false;
      } finally {
        setIsRevoking(false);
      }
    },
    [tenantId, refetch, toast]
  );

  // Update API key
  const updateApiKey = useCallback(
    async (keyId, payload) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      try {
        await AdminApi.updateApiKey(tenantId, keyId, payload);
        toast.success('API key updated successfully');
        refetch(); // Refresh the list
        return true;
      } catch (err) {
        toast.error('Failed to update API key');
        console.error('Update API key error:', err);
        return false;
      }
    },
    [tenantId, refetch, toast]
  );

  return {
    keys: data || [],
    loading,
    error,
    isCreating,
    isRevoking,
    createApiKey,
    revokeApiKey,
    updateApiKey,
    refetch,
  };
}

export default useAdminApiKeys;

/**
 * Webhooks Hook
 * Manages webhooks for a tenant with CRUD operations
 */
import { useState, useCallback } from 'react';
import { useApiQuery } from './useSimpleApiQuery';
import { AdminApi } from '../lib/adminApi';
import { useTenant } from '../contexts/TenantContext';
import { useToast } from '../components/Toast';

export function useWebhooks() {
  const { tenantId } = useTenant();
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Fetch webhooks
  const { data, loading, error, refetch } = useApiQuery(
    () => AdminApi.listWebhooks(tenantId),
    [tenantId]
  );

  // Create new webhook
  const createWebhook = useCallback(
    async (payload) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return null;
      }

      setIsCreating(true);
      try {
        const response = await AdminApi.createWebhook(tenantId, payload);
        toast.success('Webhook created successfully');
        refetch(); // Refresh the list
        return response.data;
      } catch (err) {
        toast.error('Failed to create webhook');
        console.error('Create webhook error:', err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [tenantId, refetch, toast]
  );

  // Update webhook
  const updateWebhook = useCallback(
    async (webhookId, payload) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      try {
        await AdminApi.updateWebhook(tenantId, webhookId, payload);
        toast.success('Webhook updated successfully');
        refetch(); // Refresh the list
        return true;
      } catch (err) {
        toast.error('Failed to update webhook');
        console.error('Update webhook error:', err);
        return false;
      }
    },
    [tenantId, refetch, toast]
  );

  // Delete webhook
  const deleteWebhook = useCallback(
    async (webhookId) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      setIsDeleting(true);
      try {
        await AdminApi.deleteWebhook(tenantId, webhookId);
        toast.success('Webhook deleted successfully');
        refetch(); // Refresh the list
        return true;
      } catch (err) {
        toast.error('Failed to delete webhook');
        console.error('Delete webhook error:', err);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [tenantId, refetch, toast]
  );

  // Test webhook
  const testWebhook = useCallback(
    async (webhookId) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      setIsTesting(true);
      try {
        await AdminApi.testWebhook(tenantId, webhookId);
        toast.success('Test webhook sent successfully');
        return true;
      } catch (err) {
        toast.error('Failed to test webhook');
        console.error('Test webhook error:', err);
        return false;
      } finally {
        setIsTesting(false);
      }
    },
    [tenantId, toast]
  );

  // Get webhook logs
  const getWebhookLogs = useCallback(
    async (webhookId, params = {}) => {
      if (!tenantId) return null;

      try {
        const response = await AdminApi.getWebhookLogs(tenantId, webhookId, params);
        return response.data;
      } catch (err) {
        console.error('Get webhook logs error:', err);
        return null;
      }
    },
    [tenantId]
  );

  return {
    webhooks: data || [],
    loading,
    error,
    isCreating,
    isDeleting,
    isTesting,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook,
    getWebhookLogs,
    refetch,
  };
}

export default useWebhooks;

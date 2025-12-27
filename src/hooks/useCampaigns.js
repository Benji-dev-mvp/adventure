/**
 * Campaigns Hook
 * Manages campaigns with CRUD operations
 */
import { useState, useCallback } from 'react';
import { useApiQuery } from './useSimpleApiQuery';
import { CampaignsApi } from '../lib/campaignsApi';
import { useTenant } from '../contexts/TenantContext';
import { useToast } from '../components/Toast';

export function useCampaigns(params = {}) {
  const { tenantId } = useTenant();
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Fetch campaigns
  const { data, loading, error, refetch } = useApiQuery(
    () => CampaignsApi.listCampaigns(tenantId, params),
    [tenantId, JSON.stringify(params)]
  );

  // Create new campaign
  const createCampaign = useCallback(
    async (payload) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return null;
      }

      setIsCreating(true);
      try {
        const response = await CampaignsApi.createCampaign(tenantId, payload);
        toast.success('Campaign created successfully');
        refetch(); // Refresh the list
        return response.data;
      } catch (err) {
        toast.error('Failed to create campaign');
        console.error('Create campaign error:', err);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [tenantId, refetch, toast]
  );

  // Update campaign
  const updateCampaign = useCallback(
    async (campaignId, payload) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      try {
        await CampaignsApi.updateCampaign(tenantId, campaignId, payload);
        toast.success('Campaign updated successfully');
        refetch(); // Refresh the list
        return true;
      } catch (err) {
        toast.error('Failed to update campaign');
        console.error('Update campaign error:', err);
        return false;
      }
    },
    [tenantId, refetch, toast]
  );

  // Delete campaign
  const deleteCampaign = useCallback(
    async (campaignId) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      try {
        await CampaignsApi.deleteCampaign(tenantId, campaignId);
        toast.success('Campaign deleted successfully');
        refetch(); // Refresh the list
        return true;
      } catch (err) {
        toast.error('Failed to delete campaign');
        console.error('Delete campaign error:', err);
        return false;
      }
    },
    [tenantId, refetch, toast]
  );

  // Launch campaign
  const launchCampaign = useCallback(
    async (campaignId) => {
      if (!tenantId) {
        toast.error('No tenant selected');
        return false;
      }

      setIsLaunching(true);
      try {
        await CampaignsApi.launchCampaign(tenantId, campaignId);
        toast.success('Campaign launched successfully');
        refetch(); // Refresh the list
        return true;
      } catch (err) {
        toast.error('Failed to launch campaign');
        console.error('Launch campaign error:', err);
        return false;
      } finally {
        setIsLaunching(false);
      }
    },
    [tenantId, refetch, toast]
  );

  // Pause campaign
  const pauseCampaign = useCallback(
    async (campaignId) => {
      if (!tenantId) return false;

      try {
        await CampaignsApi.pauseCampaign(tenantId, campaignId);
        toast.success('Campaign paused');
        refetch();
        return true;
      } catch (err) {
        toast.error('Failed to pause campaign');
        return false;
      }
    },
    [tenantId, refetch, toast]
  );

  // Clone campaign
  const cloneCampaign = useCallback(
    async (campaignId) => {
      if (!tenantId) return null;

      try {
        const response = await CampaignsApi.cloneCampaign(tenantId, campaignId);
        toast.success('Campaign cloned successfully');
        refetch();
        return response.data;
      } catch (err) {
        toast.error('Failed to clone campaign');
        return null;
      }
    },
    [tenantId, refetch, toast]
  );

  return {
    campaigns: data || [],
    loading,
    error,
    isCreating,
    isLaunching,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    pauseCampaign,
    cloneCampaign,
    refetch,
  };
}

export default useCampaigns;

/**
 * Custom hook for managing campaigns data and operations.
 * Centralizes campaign-related state management and API calls.
 */
import { useState, useEffect, useCallback } from 'react';
import { getCampaigns, saveCampaign, getCampaignDraft } from '../lib/dataService';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all campaigns
  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save or update campaign
  const save = useCallback(async (campaign) => {
    try {
      const saved = saveCampaign(campaign);
      await fetchCampaigns();
      return saved;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [fetchCampaigns]);

  // Get campaign draft
  const getDraft = useCallback((campaignId) => {
    try {
      return getCampaignDraft(campaignId);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    save,
    getDraft,
    refetch: fetchCampaigns,
  };
};

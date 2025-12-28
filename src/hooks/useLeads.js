/**
 * Custom hook for managing leads data and operations.
 * Centralizes lead-related state management and API calls.
 */
import { useState, useEffect, useCallback } from 'react';
import { getLeads, searchLeads, updateLeadStatus, addLeadActivity } from '../lib/dataService';

export const useLeads = (initialQuery = '') => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);

  // Fetch leads based on query
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = query ? searchLeads(query) : getLeads();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Update lead status
  const updateStatus = useCallback(async (leadId, status) => {
    try {
      const updated = updateLeadStatus(leadId, status);
      setLeads(updated);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Add activity to lead
  const addActivity = useCallback(async (leadId, activity) => {
    try {
      const updatedLead = addLeadActivity(leadId, activity);
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? updatedLead : lead
        )
      );
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Search leads
  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    search,
    updateStatus,
    addActivity,
    refetch: fetchLeads,
  };
};

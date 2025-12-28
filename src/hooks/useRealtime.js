/**
 * Real-time Hooks
 * React hooks for WebSocket subscriptions
 */
import { useEffect, useState, useCallback } from 'react';
import socketManager from '../lib/realtime/socket';
import { useUserStore } from '../stores/appStore';

/**
 * Hook to manage WebSocket connection
 */
export const useSocket = () => {
  const [connectionState, setConnectionState] = useState('disconnected');
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Connect when user is authenticated
    if (user?.token) {
      socketManager.connect(user.token);
    }

    // Listen for connection state changes
    const unsubscribe = socketManager.onConnectionChange((state) => {
      setConnectionState(state);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.token]);

  const send = useCallback((event, payload) => {
    socketManager.send(event, payload);
  }, []);

  return {
    isConnected: connectionState === 'connected',
    connectionState,
    send,
  };
};

/**
 * Hook for real-time campaign updates
 */
export const useCampaignRealtime = (campaignId) => {
  const [campaignData, setCampaignData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      setIsLoading(false);
      return;
    }

    // Subscribe to campaign updates
    const unsubscribe = socketManager.subscribe(
      `campaign.${campaignId}.update`,
      (data) => {
        setCampaignData(data);
        setIsLoading(false);
      }
    );

    // Request initial data
    socketManager.send('campaign.subscribe', { campaignId });

    return () => {
      unsubscribe();
      socketManager.send('campaign.unsubscribe', { campaignId });
    };
  }, [campaignId]);

  return { campaignData, isLoading };
};

/**
 * Hook for real-time notifications
 */
export const useNotificationsRealtime = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = socketManager.subscribe('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return unsubscribe;
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, clearNotifications };
};

/**
 * Hook for real-time activity feed
 */
export const useActivityFeedRealtime = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to activity feed
    const unsubscribe = socketManager.subscribe('activity', (data) => {
      setActivities((prev) => [data, ...prev].slice(0, 50)); // Keep last 50
      setIsLoading(false);
    });

    // Request initial data
    socketManager.send('activity.subscribe');

    return () => {
      unsubscribe();
      socketManager.send('activity.unsubscribe');
    };
  }, []);

  return { activities, isLoading };
};

/**
 * Generic hook for subscribing to real-time events
 */
export const useRealtimeEvent = (event, callback, dependencies = []) => {
  useEffect(() => {
    if (!event || !callback) return;

    const unsubscribe = socketManager.subscribe(event, callback);
    return unsubscribe;
  }, [event, callback, ...dependencies]);
};

/**
 * Hook for real-time lead updates
 */
export const useLeadRealtime = (leadId) => {
  const [leadData, setLeadData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!leadId) {
      setIsLoading(false);
      return;
    }

    // Subscribe to lead updates
    const unsubscribe = socketManager.subscribe(
      `lead.${leadId}.update`,
      (data) => {
        setLeadData(data);
        setIsLoading(false);
      }
    );

    // Request initial data
    socketManager.send('lead.subscribe', { leadId });

    return () => {
      unsubscribe();
      socketManager.send('lead.unsubscribe', { leadId });
    };
  }, [leadId]);

  return { leadData, isLoading };
};

export default {
  useSocket,
  useCampaignRealtime,
  useNotificationsRealtime,
  useActivityFeedRealtime,
  useRealtimeEvent,
  useLeadRealtime,
};

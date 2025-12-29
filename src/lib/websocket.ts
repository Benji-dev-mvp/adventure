/**
 * WebSocket Service
 * Real-time communication for live updates
 */
import { io, Socket } from 'socket.io-client';
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../stores/userStore';
import { queryKeys } from './queryClient';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Event types for type safety
export type WebSocketEvent =
  | 'campaign:update'
  | 'campaign:metrics'
  | 'lead:update'
  | 'lead:new'
  | 'notification:new'
  | 'activity:new'
  | 'email:sent'
  | 'email:opened'
  | 'email:clicked'
  | 'email:replied';

interface WebSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
}

/**
 * Initialize WebSocket connection
 */
export function initializeSocket(token: string, options: WebSocketOptions = {}): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    auth: { token },
    reconnection: options.reconnection ?? true,
    reconnectionDelay: options.reconnectionDelay ?? 1000,
    reconnectionDelayMax: options.reconnectionDelayMax ?? 5000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    autoConnect: options.autoConnect ?? true,
    transports: ['websocket', 'polling'],
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('[WebSocket] Connected:', socket?.id);
    reconnectAttempts = 0;
  });

  socket.on('disconnect', (reason) => {
    console.log('[WebSocket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[WebSocket] Connection error:', error.message);
    reconnectAttempts++;

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WebSocket] Max reconnection attempts reached');
      socket?.disconnect();
    }
  });

  socket.on('error', (error) => {
    console.error('[WebSocket] Error:', error);
  });

  return socket;
}

/**
 * Disconnect WebSocket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
}

/**
 * Get current socket instance
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Check if socket is connected
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

// ============================================
// React Hooks for WebSocket
// ============================================

/**
 * Hook to manage WebSocket connection lifecycle
 */
export function useWebSocket() {
  const token = useUserStore((state) => state.token);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && token) {
      initializeSocket(token);
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive
      // disconnectSocket();
    };
  }, [isAuthenticated, token]);

  return {
    socket: getSocket(),
    isConnected: isSocketConnected(),
    disconnect: disconnectSocket,
  };
}

/**
 * Hook for real-time campaign updates
 */
export function useCampaignRealtime(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !campaignId) return;

    // Join campaign room
    socket.emit('join:campaign', campaignId);

    // Listen for campaign updates
    const handleUpdate = (data: unknown) => {
      queryClient.setQueryData(queryKeys.campaigns.detail(campaignId), data);
    };

    const handleMetrics = (metrics: unknown) => {
      queryClient.setQueryData(
        queryKeys.campaigns.detail(campaignId),
        (old: Record<string, unknown> | undefined) =>
          old ? { ...old, metrics } : old
      );
    };

    socket.on(`campaign:${campaignId}:update`, handleUpdate);
    socket.on(`campaign:${campaignId}:metrics`, handleMetrics);

    return () => {
      socket?.emit('leave:campaign', campaignId);
      socket?.off(`campaign:${campaignId}:update`, handleUpdate);
      socket?.off(`campaign:${campaignId}:metrics`, handleMetrics);
    };
  }, [campaignId, queryClient]);
}

/**
 * Hook for real-time lead updates
 */
export function useLeadRealtime(leadId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleLeadUpdate = (data: { id: string; [key: string]: unknown }) => {
      // Update specific lead if watching one
      if (leadId && data.id === leadId) {
        queryClient.setQueryData(queryKeys.leads.detail(leadId), data);
      }

      // Invalidate lead list to refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    };

    const handleNewLead = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.stats() });
    };

    socket.on('lead:update', handleLeadUpdate);
    socket.on('lead:new', handleNewLead);

    return () => {
      socket?.off('lead:update', handleLeadUpdate);
      socket?.off('lead:new', handleNewLead);
    };
  }, [leadId, queryClient]);
}

/**
 * Hook for real-time notifications
 */
export function useNotificationRealtime(onNotification?: (notification: unknown) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: unknown) => {
      // Invalidate notifications query
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() });

      // Call custom handler if provided
      onNotification?.(notification);
    };

    socket.on('notification:new', handleNotification);

    return () => {
      socket?.off('notification:new', handleNotification);
    };
  }, [queryClient, onNotification]);
}

/**
 * Hook for real-time activity feed
 */
export function useActivityRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleActivity = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.activities() });
    };

    socket.on('activity:new', handleActivity);
    socket.on('email:sent', handleActivity);
    socket.on('email:opened', handleActivity);
    socket.on('email:clicked', handleActivity);
    socket.on('email:replied', handleActivity);

    return () => {
      socket?.off('activity:new', handleActivity);
      socket?.off('email:sent', handleActivity);
      socket?.off('email:opened', handleActivity);
      socket?.off('email:clicked', handleActivity);
      socket?.off('email:replied', handleActivity);
    };
  }, [queryClient]);
}

/**
 * Generic hook to subscribe to any WebSocket event
 */
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void,
  deps: unknown[] = []
) {
  const stableHandler = useCallback(handler, deps);

  useEffect(() => {
    if (!socket) return;

    socket.on(event, stableHandler);

    return () => {
      socket?.off(event, stableHandler);
    };
  }, [event, stableHandler]);
}

/**
 * Hook to emit WebSocket events
 */
export function useSocketEmit() {
  const emit = useCallback((event: string, data?: unknown) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('[WebSocket] Cannot emit - not connected');
    }
  }, []);

  return emit;
}

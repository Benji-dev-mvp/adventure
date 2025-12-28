import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User Store
 * Manages user authentication state and preferences
 */
export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
        emailDigest: 'daily',
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
      }),
    }
  )
);

/**
 * UI Store
 * Manages UI state (sidebar, modals, command palette, etc.)
 */
export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  activeModal: null,
  modalData: null,
  
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),
  
  openCommandPalette: () =>
    set({ commandPaletteOpen: true }),
  
  closeCommandPalette: () =>
    set({ commandPaletteOpen: false }),
  
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  
  openModal: (modalName, data = null) =>
    set({ activeModal: modalName, modalData: data }),
  
  closeModal: () =>
    set({ activeModal: null, modalData: null }),
}));

/**
 * Notification Store
 * Manages notifications and unread counts
 */
export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          read: false,
          ...notification,
        },
        ...state.notifications,
      ].slice(0, 50), // Keep only last 50 notifications
      unreadCount: state.unreadCount + 1,
    })),
  
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  
  clearNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }),
  
  clearAllNotifications: () =>
    set({ notifications: [], unreadCount: 0 }),
}));

/**
 * App Store
 * General application state
 */
export const useAppStore = create((set) => ({
  isOnline: navigator.onLine,
  lastSync: null,
  syncStatus: 'idle', // 'idle' | 'syncing' | 'success' | 'error'
  
  setOnlineStatus: (status) =>
    set({ isOnline: status }),
  
  setSyncStatus: (status) =>
    set({ syncStatus: status }),
  
  updateLastSync: () =>
    set({ lastSync: new Date().toISOString() }),
}));

// Export all stores
export default {
  useUserStore,
  useUIStore,
  useNotificationStore,
  useAppStore,
};

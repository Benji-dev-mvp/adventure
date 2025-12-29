/**
 * User Store - Zustand with Immer middleware
 * Handles user state, authentication, and preferences
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  organizationId: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailDigest: 'daily' | 'weekly' | 'never';
  compactMode: boolean;
  sidebarCollapsed: boolean;
}

interface UserState {
  // State
  user: User | null;
  token: string | null;
  preferences: UserPreferences;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  emailDigest: 'daily',
  compactMode: false,
  sidebarCollapsed: false,
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        user: null,
        token: null,
        preferences: defaultPreferences,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
          }),

        setToken: (token) =>
          set((state) => {
            state.token = token;
          }),

        updatePreferences: (prefs) =>
          set((state) => {
            state.preferences = { ...state.preferences, ...prefs };
          }),

        login: (user, token) =>
          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.isLoading = false;
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),
      })),
      {
        name: 'user-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          preferences: state.preferences,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'UserStore' }
  )
);

// Selectors for optimized re-renders
export const selectUser = (state: UserState) => state.user;
export const selectToken = (state: UserState) => state.token;
export const selectPreferences = (state: UserState) => state.preferences;
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;
export const selectTheme = (state: UserState) => state.preferences.theme;

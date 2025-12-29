/**
 * UI Store - Zustand
 * Handles UI state like modals, sidebars, and global UI settings
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarHovered: boolean;

  // Modals
  modals: Record<string, ModalState>;

  // Command palette
  commandPaletteOpen: boolean;

  // Global loading
  globalLoading: boolean;
  loadingMessage: string;

  // Notifications panel
  notificationsPanelOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarHovered: (hovered: boolean) => void;

  // Modal actions
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;

  // Command palette
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Loading
  setGlobalLoading: (loading: boolean, message?: string) => void;

  // Notifications
  toggleNotificationsPanel: () => void;
  setNotificationsPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    immer(set => ({
      // Initial state
      sidebarCollapsed: false,
      sidebarHovered: false,
      modals: {},
      commandPaletteOpen: false,
      globalLoading: false,
      loadingMessage: '',
      notificationsPanelOpen: false,

      // Sidebar actions
      toggleSidebar: () =>
        set(state => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

      setSidebarCollapsed: collapsed =>
        set(state => {
          state.sidebarCollapsed = collapsed;
        }),

      setSidebarHovered: hovered =>
        set(state => {
          state.sidebarHovered = hovered;
        }),

      // Modal actions
      openModal: (id, data) =>
        set(state => {
          state.modals[id] = { isOpen: true, data };
        }),

      closeModal: id =>
        set(state => {
          if (state.modals[id]) {
            state.modals[id].isOpen = false;
          }
        }),

      toggleModal: id =>
        set(state => {
          if (state.modals[id]) {
            state.modals[id].isOpen = !state.modals[id].isOpen;
          } else {
            state.modals[id] = { isOpen: true };
          }
        }),

      // Command palette
      toggleCommandPalette: () =>
        set(state => {
          state.commandPaletteOpen = !state.commandPaletteOpen;
        }),

      setCommandPaletteOpen: open =>
        set(state => {
          state.commandPaletteOpen = open;
        }),

      // Loading
      setGlobalLoading: (loading, message = '') =>
        set(state => {
          state.globalLoading = loading;
          state.loadingMessage = message;
        }),

      // Notifications
      toggleNotificationsPanel: () =>
        set(state => {
          state.notificationsPanelOpen = !state.notificationsPanelOpen;
        }),

      setNotificationsPanelOpen: open =>
        set(state => {
          state.notificationsPanelOpen = open;
        }),
    })),
    { name: 'UIStore' }
  )
);

// Selectors
export const selectSidebarCollapsed = (state: UIState) => state.sidebarCollapsed;
export const selectModals = (state: UIState) => state.modals;
export const selectCommandPaletteOpen = (state: UIState) => state.commandPaletteOpen;
export const selectGlobalLoading = (state: UIState) => ({
  loading: state.globalLoading,
  message: state.loadingMessage,
});

// Modal helper hook
export const useModal = (modalId: string) => {
  const modal = useUIStore(state => state.modals[modalId]);
  const openModal = useUIStore(state => state.openModal);
  const closeModal = useUIStore(state => state.closeModal);

  return {
    isOpen: modal?.isOpen ?? false,
    data: modal?.data,
    open: (data?: unknown) => openModal(modalId, data),
    close: () => closeModal(modalId),
  };
};

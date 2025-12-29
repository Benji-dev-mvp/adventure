/**
 * Keyboard Shortcuts Hook
 * Provides global keyboard shortcuts for power users
 */
import { useEffect, useCallback, useRef } from 'react';

// Default keyboard shortcuts configuration
const DEFAULT_SHORTCUTS = {
  // Navigation
  'g d': { action: 'navigate', path: '/dashboard', description: 'Go to Dashboard' },
  'g l': { action: 'navigate', path: '/leads', description: 'Go to Leads' },
  'g c': { action: 'navigate', path: '/campaigns', description: 'Go to Campaigns' },
  'g a': { action: 'navigate', path: '/analytics', description: 'Go to Analytics' },
  'g s': { action: 'navigate', path: '/settings', description: 'Go to Settings' },
  'g i': { action: 'navigate', path: '/integrations', description: 'Go to Integrations' },
  'g h': { action: 'navigate', path: '/help', description: 'Go to Help Center' },

  // Actions
  'n c': { action: 'custom', id: 'newCampaign', description: 'New Campaign' },
  'n l': { action: 'custom', id: 'newLead', description: 'New Lead' },
  'n t': { action: 'custom', id: 'newTemplate', description: 'New Template' },

  // UI
  Escape: { action: 'custom', id: 'closeModal', description: 'Close Modal/Dialog' },
  '?': { action: 'custom', id: 'showShortcuts', description: 'Show Shortcuts' },
};

/**
 * useKeyboardShortcuts - Global keyboard shortcuts hook
 * @param {Object} customHandlers - Custom action handlers { actionId: callback }
 * @param {Function} navigate - React Router navigate function
 * @param {Object} options - Configuration options
 */
export function useKeyboardShortcuts(customHandlers = {}, navigate = null, options = {}) {
  const { enabled = true, shortcuts = DEFAULT_SHORTCUTS, ignoreInputs = true } = options;

  const keySequence = useRef('');
  const keyTimeout = useRef(null);

  const handleKeyDown = useCallback(
    event => {
      if (!enabled) return;

      // Ignore if typing in input, textarea, or contenteditable
      if (ignoreInputs) {
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          target.isContentEditable
        ) {
          // Allow Escape in inputs
          if (event.key !== 'Escape') return;
        }
      }

      // Handle Command/Ctrl + K separately (for command palette)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (customHandlers.openCommandPalette) {
          customHandlers.openCommandPalette();
        }
        return;
      }

      // Build key sequence for multi-key shortcuts
      const key = event.key;

      // Clear previous timeout
      if (keyTimeout.current) {
        clearTimeout(keyTimeout.current);
      }

      // Add to sequence
      if (keySequence.current) {
        keySequence.current += ' ' + key;
      } else {
        keySequence.current = key;
      }

      // Check for matching shortcut
      const shortcut = shortcuts[keySequence.current];

      if (shortcut) {
        event.preventDefault();
        keySequence.current = '';

        switch (shortcut.action) {
          case 'navigate':
            if (navigate) {
              navigate(shortcut.path);
            }
            break;
          case 'custom':
            if (customHandlers[shortcut.id]) {
              customHandlers[shortcut.id]();
            }
            break;
          default:
            break;
        }
      } else {
        // Check if current sequence could lead to a valid shortcut
        const couldMatch = Object.keys(shortcuts).some(s => s.startsWith(keySequence.current));

        if (!couldMatch) {
          keySequence.current = '';
        } else {
          // Set timeout to clear sequence
          keyTimeout.current = setTimeout(() => {
            keySequence.current = '';
          }, 1000);
        }
      }
    },
    [enabled, shortcuts, ignoreInputs, navigate, customHandlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyTimeout.current) {
        clearTimeout(keyTimeout.current);
      }
    };
  }, [handleKeyDown]);

  return {
    shortcuts: DEFAULT_SHORTCUTS,
  };
}

/**
 * Shortcut display helper - formats shortcut for display
 */
export function formatShortcut(shortcut) {
  return shortcut
    .split(' ')
    .map(key => {
      if (key === 'Meta' || key === 'Ctrl') return '⌘';
      if (key === 'Alt') return '⌥';
      if (key === 'Shift') return '⇧';
      if (key === 'Escape') return 'Esc';
      return key.toUpperCase();
    })
    .join(' ');
}

/**
 * Get all shortcuts grouped by category
 */
export function getShortcutGroups() {
  return {
    Navigation: [
      { keys: 'g d', description: 'Go to Dashboard' },
      { keys: 'g l', description: 'Go to Leads' },
      { keys: 'g c', description: 'Go to Campaigns' },
      { keys: 'g a', description: 'Go to Analytics' },
      { keys: 'g s', description: 'Go to Settings' },
      { keys: 'g i', description: 'Go to Integrations' },
    ],
    Actions: [
      { keys: '⌘ K', description: 'Open Command Palette' },
      { keys: 'n c', description: 'New Campaign' },
      { keys: 'n l', description: 'New Lead' },
      { keys: 'n t', description: 'New Template' },
    ],
    General: [
      { keys: '?', description: 'Show Keyboard Shortcuts' },
      { keys: 'Esc', description: 'Close Modal/Dialog' },
    ],
  };
}

export default useKeyboardShortcuts;

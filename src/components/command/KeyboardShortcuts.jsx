import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Command, X } from 'lucide-react';

// Keyboard Shortcuts Manager
const KeyboardShortcuts = ({ commandPaletteOpen, setCommandPaletteOpen }) => {
  const [showHelp, setShowHelp] = useState(false);

  // Define all keyboard shortcuts
  const shortcuts = [
    { key: '⌘K', description: 'Open command palette', category: 'General' },
    { key: '⌘/', description: 'Show keyboard shortcuts', category: 'General' },
    { key: 'G then D', description: 'Go to Dashboard', category: 'Navigation' },
    { key: 'G then C', description: 'Go to Campaigns', category: 'Navigation' },
    { key: 'G then L', description: 'Go to Leads', category: 'Navigation' },
    { key: 'G then A', description: 'Go to Analytics', category: 'Navigation' },
    { key: 'G then I', description: 'Go to AI Assistant', category: 'Navigation' },
    { key: 'N then C', description: 'New Campaign', category: 'Actions' },
    { key: 'N then T', description: 'New Template', category: 'Actions' },
    { key: 'I', description: 'Import Leads', category: 'Actions' },
    { key: 'S', description: 'Save (when editing)', category: 'Actions' },
    { key: '?', description: 'Toggle help', category: 'General' },
  ];

  useEffect(() => {
    let sequenceBuffer = '';
    let sequenceTimeout;

    const handleKeyDown = e => {
      // Check for Cmd/Ctrl + K (Command Palette)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      // Check for Cmd/Ctrl + / (Keyboard Shortcuts Help)
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Check for ? (Help)
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Sequence shortcuts (G then X, N then X)
      if (!isInputFocused() && !e.metaKey && !e.ctrlKey) {
        sequenceBuffer += e.key.toLowerCase();
        clearTimeout(sequenceTimeout);

        // Reset sequence after 1 second
        sequenceTimeout = setTimeout(() => {
          sequenceBuffer = '';
        }, 1000);

        // Check for "go to" shortcuts (g + key)
        if (sequenceBuffer === 'gd') {
          window.location.href = '/dashboard';
          sequenceBuffer = '';
        } else if (sequenceBuffer === 'gc') {
          window.location.href = '/campaigns';
          sequenceBuffer = '';
        } else if (sequenceBuffer === 'gl') {
          window.location.href = '/lead-database';
          sequenceBuffer = '';
        } else if (sequenceBuffer === 'ga') {
          window.location.href = '/analytics';
          sequenceBuffer = '';
        } else if (sequenceBuffer === 'gi') {
          window.location.href = '/ai-assistant';
          sequenceBuffer = '';
        }
        // Check for "new" shortcuts (n + key)
        else if (sequenceBuffer === 'nc') {
          window.location.href = '/campaigns?new=true';
          sequenceBuffer = '';
        } else if (sequenceBuffer === 'nt') {
          window.location.href = '/templates?new=true';
          sequenceBuffer = '';
        }
        // Single key shortcuts
        else if (e.key === 'i' && sequenceBuffer === 'i') {
          window.location.href = '/leads?import=true';
          sequenceBuffer = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(sequenceTimeout);
    };
  }, [setCommandPaletteOpen]);

  // Check if an input element is focused
  const isInputFocused = () => {
    const activeElement = document.activeElement;
    return (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true')
    );
  };

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = [];
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {});

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowHelp(false)}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.preventDefault();
            setShowHelp(false);
          }
        }}
        aria-label="Close keyboard shortcuts"
      />

      {/* Shortcuts Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-9 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
              <Command className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Master the shortcuts to work faster
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded mx-1">⌘/</kbd> or{' '}
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded mx-1">?</kbd> to toggle
            this panel
          </p>
        </div>
      </div>
    </div>
  );
};

KeyboardShortcuts.propTypes = {
  commandPaletteOpen: PropTypes.bool,
  setCommandPaletteOpen: PropTypes.func,
};

export default KeyboardShortcuts;

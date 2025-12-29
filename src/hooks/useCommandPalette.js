import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { buildCommandsList } from '../config/navigationFactory';

// Context for registering commands from anywhere in the app
const CommandPaletteContext = createContext(null);

export const useCommandPaletteContext = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPaletteContext must be used within CommandPaletteProvider');
  }
  return context;
};

export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredCommands, setRegisteredCommands] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [navigate, setNavigate] = useState(null);

  // Get default commands (now from factory)
  const defaultCommands = navigate ? buildCommandsList(navigate) : [];

  // Register a command
  const registerCommand = useCallback(command => {
    setRegisteredCommands(prev => {
      const exists = prev.find(c => c.id === command.id);
      if (exists) return prev;
      return [...prev, command];
    });
    return () => {
      setRegisteredCommands(prev => prev.filter(c => c.id !== command.id));
    };
  }, []);

  // Unregister a command
  const unregisterCommand = useCallback(commandId => {
    setRegisteredCommands(prev => prev.filter(c => c.id !== commandId));
  }, []);

  // Open/close handlers
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = event => {
      // Cmd+K or Ctrl+K to open
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        togglePalette();
      }

      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePalette, closePalette]);

  return {
    isOpen,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    registeredCommands,
    registerCommand,
    unregisterCommand,
    openPalette,
    closePalette,
    togglePalette,
    setNavigate, // Setter for navigate function
    allCommands: [...defaultCommands, ...registeredCommands],
  };
};

export { CommandPaletteContext };
export default useCommandPalette;

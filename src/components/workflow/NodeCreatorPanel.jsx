import React, { useState } from 'react';
import {
  X,
  Search,
  Mail,
  Linkedin,
  Phone,
  MessageSquare,
  Clock,
  GitBranch,
  Play,
  Shuffle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { nodeDefinitions, getNodesByCategory } from './nodes';
import PropTypes from 'prop-types';

const NodeCreatorPanel = ({ isOpen, onClose, onAddNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = getNodesByCategory();

  // Filter nodes based on search
  const allNodes = Object.values(nodeDefinitions);
  const filteredNodes = allNodes.filter(
    node =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const iconMap = {
    Play,
    Mail,
    Linkedin,
    Phone,
    MessageSquare,
    Clock,
    GitBranch,
    Shuffle,
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  const handleClose = event => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        role="button"
        tabIndex={0}
        aria-label="Close node creator panel"
        onClick={handleClose}
        onKeyDown={handleClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Node</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search nodes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === key
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Node List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {searchTerm ? (
            // Search results
            filteredNodes.length > 0 ? (
              filteredNodes.map(node => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.type}
                    onClick={() => onAddNode(node.type)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                  >
                    <div className={`p-2 rounded-lg ${colorClasses[node.color]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {node.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {node.description}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No nodes found for "{searchTerm}"
              </div>
            )
          ) : (
            // Category view
            Object.entries(categories)
              .filter(([key]) => selectedCategory === 'all' || selectedCategory === key)
              .map(([key, category]) => (
                <div key={key} className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {category.label}
                  </h3>
                  <div className="space-y-2">
                    {category.nodes.map(node => {
                      const Icon = node.icon;
                      return (
                        <button
                          key={node.type}
                          onClick={() => onAddNode(node.type)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                        >
                          <div className={`p-2 rounded-lg ${colorClasses[node.color]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {node.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {node.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer - AI Suggestion */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Suggest Next Step</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default NodeCreatorPanel;

NodeCreatorPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddNode: PropTypes.func.isRequired,
};

/**
 * RightInspectorPanel - Standardized inspector for all entity types
 * 
 * Unified inspector panel used by:
 * - EntityDrawer (leads, accounts, campaigns, playbooks)
 * - WhyDrawer (AI decision lineage)
 * - Orchestration (node configuration)
 * 
 * Consistent tabs: Overview / Signals / Activity / Actions
 * 
 * Inspired by: Linear, Notion, Figma side panels
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';

// === Types ===

export type InspectorTab = 'overview' | 'signals' | 'activity' | 'actions';

export interface InspectorEntity {
  id: string;
  type: 'lead' | 'account' | 'campaign' | 'playbook' | 'node' | 'decision';
  title: string;
  subtitle?: string;
  metadata?: Record<string, any>;
}

export interface InspectorSection {
  title: string;
  content: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface Props {
  entity: InspectorEntity;
  tabs?: InspectorTab[];
  defaultTab?: InspectorTab;
  sections?: Record<InspectorTab, InspectorSection[]>;
  onClose?: () => void;
  width?: number;
}

// === Collapsible Section Component ===

const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <h4 className="text-sm font-semibold text-gray-200">{title}</h4>
        <span className="text-gray-400">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && <div className="px-4 py-3 text-sm text-gray-300">{children}</div>}
    </div>
  );
};

// === Main Component ===

export const RightInspectorPanel: React.FC<Props> = ({
  entity,
  tabs = ['overview', 'signals', 'activity', 'actions'],
  defaultTab = 'overview',
  sections,
  onClose,
  width = 400,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>(defaultTab);

  const tabLabels: Record<InspectorTab, string> = {
    overview: 'Overview',
    signals: 'Signals',
    activity: 'Activity',
    actions: 'Actions',
  };

  const defaultSections: Record<InspectorTab, InspectorSection[]> = {
    overview: [
      {
        title: 'Details',
        content: (
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Type:</span> {entity.type}
            </div>
            <div>
              <span className="text-gray-400">ID:</span> {entity.id}
            </div>
            {entity.subtitle && (
              <div>
                <span className="text-gray-400">Status:</span> {entity.subtitle}
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Metadata',
        content: (
          <div className="space-y-1">
            {entity.metadata &&
              Object.entries(entity.metadata).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-400">{key}:</span> {String(value)}
                </div>
              ))}
            {!entity.metadata && <div className="text-gray-500">No metadata available</div>}
          </div>
        ),
        collapsible: true,
        defaultExpanded: false,
      },
    ],
    signals: [
      {
        title: 'Signals',
        content: <div className="text-gray-500">No signals detected</div>,
      },
    ],
    activity: [
      {
        title: 'Recent Activity',
        content: <div className="text-gray-500">No recent activity</div>,
      },
    ],
    actions: [
      {
        title: 'Available Actions',
        content: <div className="text-gray-500">No actions available</div>,
      },
    ],
  };

  const activeSections = sections?.[activeTab] || defaultSections[activeTab];

  return (
    <div
      className="fixed right-0 top-0 h-full bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col z-50"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{entity.title}</h3>
          {entity.subtitle && <p className="text-sm text-gray-400 mt-1">{entity.subtitle}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 p-1 hover:bg-gray-800 rounded-md transition-colors flex-shrink-0"
            aria-label="Close inspector"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-cyan-400 border-cyan-400'
                : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSections.map((section, index) =>
          section.collapsible ? (
            <CollapsibleSection
              key={index}
              title={section.title}
              defaultExpanded={section.defaultExpanded}
            >
              {section.content}
            </CollapsibleSection>
          ) : (
            <div key={index} className="border-b border-gray-800 last:border-0">
              <div className="px-4 py-3">
                <h4 className="text-sm font-semibold text-gray-200 mb-3">{section.title}</h4>
                <div className="text-sm text-gray-300">{section.content}</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RightInspectorPanel;

/**
 * Entity Drawer
 * 
 * Global drawer for displaying Lead/Account/Campaign details
 * Reads from appStore.selectedEntity and renders appropriate content
 */

import React, { useState } from 'react';
import { X, User, Building2, Target, Activity, Lightbulb, TrendingUp } from 'lucide-react';
import { useAppStore, useSelectedEntity } from '@/state/appStore';
import { cn } from '@/lib/utils';
import { BadgePill } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/Card';

interface EntityDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type TabType = 'overview' | 'signals' | 'activity' | 'actions';

export const EntityDrawer: React.FC<EntityDrawerProps> = ({ isOpen: controlledIsOpen, onClose }) => {
  const selectedEntity = useSelectedEntity();
  const clearSelectedEntity = useAppStore((state) => state.clearSelectedEntity);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Drawer is open if there's a selected entity or if controlled
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : !!selectedEntity;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      clearSelectedEntity();
    }
  };

  if (!isOpen || !selectedEntity) {
    return null;
  }

  const tabs: Array<{ id: TabType; label: string; icon: any }> = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'signals', label: 'Signals', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'actions', label: 'Actions', icon: Lightbulb },
  ];

  const getEntityIcon = () => {
    switch (selectedEntity.type) {
      case 'lead':
        return User;
      case 'account':
        return Building2;
      case 'campaign':
        return Target;
      default:
        return User;
    }
  };

  const EntityIcon = getEntityIcon();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-slate-950 border-l border-slate-800 z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <EntityIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedEntity.name}</h2>
                <BadgePill variant="default" className="mt-1">
                  {selectedEntity.type.toUpperCase()}
                </BadgePill>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewTab entity={selectedEntity} />}
          {activeTab === 'signals' && <SignalsTab entity={selectedEntity} />}
          {activeTab === 'activity' && <ActivityTab entity={selectedEntity} />}
          {activeTab === 'actions' && <ActionsTab entity={selectedEntity} />}
        </div>
      </div>
    </>
  );
};

// Tab Components

const OverviewTab: React.FC<{ entity: any }> = ({ entity }) => (
  <div className="space-y-4">
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Details</h3>
        <dl className="space-y-2">
          <div className="flex justify-between text-sm">
            <dt className="text-slate-400">ID:</dt>
            <dd className="text-white font-mono">{entity.id}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-slate-400">Type:</dt>
            <dd className="text-white capitalize">{entity.type}</dd>
          </div>
          {entity.metadata && Object.entries(entity.metadata).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <dt className="text-slate-400 capitalize">{key}:</dt>
              <dd className="text-white">{String(value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>

    {entity.type === 'lead' && (
      <>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Lead Score</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: '75%' }} />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">75</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">High-quality lead</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">Email: <span className="text-white">contact@example.com</span></p>
              <p className="text-slate-400">Phone: <span className="text-white">+1 (555) 123-4567</span></p>
              <p className="text-slate-400">Company: <span className="text-white">TechCorp Inc.</span></p>
            </div>
          </CardContent>
        </Card>
      </>
    )}
  </div>
);

const SignalsTab: React.FC<{ entity: any }> = ({ entity }) => (
  <div className="space-y-4">
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Engagement Signals</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
            <div>
              <p className="text-sm text-white">Opened 3 emails in last 7 days</p>
              <p className="text-xs text-slate-400">High engagement</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5" />
            <div>
              <p className="text-sm text-white">Visited pricing page twice</p>
              <p className="text-xs text-slate-400">Buying intent detected</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
            <div>
              <p className="text-sm text-white">Company hiring for similar roles</p>
              <p className="text-xs text-slate-400">Growth signal</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

const ActivityTab: React.FC<{ entity: any }> = ({ entity }) => (
  <div className="space-y-3">
    {[
      { time: '2 hours ago', action: 'Email opened', type: 'email' },
      { time: '1 day ago', action: 'Replied to sequence', type: 'reply' },
      { time: '3 days ago', action: 'Added to campaign', type: 'system' },
      { time: '5 days ago', action: 'First contact', type: 'email' },
    ].map((item, idx) => (
      <Card key={idx}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">{item.action}</p>
              <p className="text-xs text-slate-400">{item.time}</p>
            </div>
            <BadgePill variant="default" className="text-xs">
              {item.type}
            </BadgePill>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ActionsTab: React.FC<{ entity: any }> = ({ entity }) => (
  <div className="space-y-3">
    <Card className="border-emerald-500/30 bg-emerald-500/5">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-emerald-400 mb-2">Recommended</h3>
        <p className="text-sm text-white mb-3">Send personalized follow-up</p>
        <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium">
          Take Action
        </button>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
            Schedule Meeting
          </button>
          <button className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
            Add to Campaign
          </button>
          <button className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
            Update Status
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default EntityDrawer;

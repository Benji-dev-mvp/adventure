/**
 * Segment Switcher - Demo segment selection for testing
 * 
 * Allows switching between startup, midmarket, and enterprise plans
 * to test segment-specific UI and feature gating.
 */

import React from 'react';
import { Building2, Rocket, Crown, CheckCircle } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';

const SEGMENTS = [
  {
    id: 'startup',
    label: 'Startup',
    description: 'Core automation, basic AI',
    icon: Rocket,
    color: 'bg-green-500',
    features: ['Ava AI BDR', 'Core Campaigns', 'Basic Analytics'],
  },
  {
    id: 'midmarket',
    label: 'Midmarket',
    description: 'Full AI Operator, advanced analytics',
    icon: Building2,
    color: 'bg-blue-500',
    features: ['All Startup features', 'Revenue Engine', 'AI Parliament', 'Forecasting'],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    description: 'Full platform, admin controls',
    icon: Crown,
    color: 'bg-purple-500',
    features: ['All Midmarket features', 'Enterprise Admin', 'Boardroom', 'Immersive View'],
  },
];

export function SegmentSwitcher({ compact = false }) {
  const { plan, setPlan, isDemo } = useTenant();

  if (!isDemo && !compact) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Segment switching is only available in demo mode.
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Demo Segment:
        </label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SEGMENTS.map((segment) => (
            <option key={segment.id} value={segment.id}>
              {segment.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Demo Segment
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Switch between segments to preview different feature sets and UI variations.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        {SEGMENTS.map((segment) => {
          const Icon = segment.icon;
          const isSelected = plan === segment.id;
          
          return (
            <button
              key={segment.id}
              onClick={() => setPlan(segment.id)}
              className={cn(
                'relative rounded-xl border-2 p-4 text-left transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <div className={cn('rounded-lg p-2', segment.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {segment.label}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {segment.description}
              </p>
              
              <ul className="space-y-1">
                {segment.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <div className="h-1 w-1 rounded-full bg-gray-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Demo Mode:</strong> You're viewing a demo organization. 
          Switching segments will change visible features and demo data throughout the app.
        </p>
      </div>
    </div>
  );
}

export default SegmentSwitcher;

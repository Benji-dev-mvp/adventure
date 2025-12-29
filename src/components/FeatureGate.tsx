/**
 * FeatureGate Component
 * 
 * Plan-based feature gating with enterprise preview UX
 * 
 * Usage:
 * <FeatureGate featureKey="autopilot" plan={plan}>
 *   <ActualFeatureComponent />
 * </FeatureGate>
 * 
 * When locked: Shows high-quality "Enterprise Preview" surface with:
 * - Visual mockup/screenshot
 * - Feature description
 * - Upgrade CTA
 * - Disabled interactive elements
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useFeatureAccess, useAppPlan, getFeatureConfig } from '@/state/appStore';
import { Lock, Sparkles, ArrowRight, Crown } from 'lucide-react';

interface FeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showPreview?: boolean; // If true, show children with overlay; if false, show custom fallback
}

/**
 * Feature Gate component
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  featureKey,
  children,
  fallback,
  showPreview = true,
}) => {
  const plan = useAppPlan();
  const featureConfig = getFeatureConfig(featureKey);
  const access = useFeatureAccess(featureKey, featureConfig.minPlan, featureConfig.requiresAdmin);

  // If unlocked, render children normally
  if (!access.locked) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // If showPreview is false, don't render anything
  if (!showPreview) {
    return null;
  }

  // Render enterprise preview overlay
  return (
    <div className="relative">
      {/* Blurred/dimmed content */}
      <div className="pointer-events-none opacity-40 blur-sm select-none">
        {children}
      </div>

      {/* Overlay with upgrade prompt */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-amber-500 to-purple-500">
            <Crown className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {access.badgeText} Feature
          </h3>

          {/* Description */}
          <p className="text-slate-300 mb-6">
            {access.reason || `This feature requires ${access.badgeText} plan or higher.`}
          </p>

          {/* Badge pills */}
          {featureConfig.badges && featureConfig.badges.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {featureConfig.badges.map((badge) => {
                const badgeStyles = {
                  AI: 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white',
                  Beta: 'bg-purple-500 text-white',
                  New: 'bg-emerald-500 text-white',
                  Exec: 'bg-rose-500 text-white',
                  Pro: 'bg-amber-500 text-slate-900',
                };
                return (
                  <span
                    key={badge}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold uppercase',
                      badgeStyles[badge]
                    )}
                  >
                    {badge}
                  </span>
                );
              })}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                // TODO: Wire to actual upgrade flow
                console.log('Upgrade to', access.minPlan);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade to {access.badgeText}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                // TODO: Wire to demo/preview flow
                console.log('Request demo for', featureKey);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-slate-200 font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              Request Demo
            </button>
          </div>

          {/* Additional info */}
          <p className="mt-6 text-xs text-slate-500">
            Contact sales for a personalized demo and pricing
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Simpler inline feature lock badge
 * For use in nav items, buttons, etc.
 */
export const FeatureLockBadge: React.FC<{ featureKey: string; className?: string }> = ({
  featureKey,
  className,
}) => {
  const featureConfig = getFeatureConfig(featureKey);
  const access = useFeatureAccess(featureKey, featureConfig.minPlan, featureConfig.requiresAdmin);

  if (!access.locked) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700',
        className
      )}
    >
      <Lock className="w-3 h-3" />
      {access.badgeText}
    </span>
  );
};

/**
 * Hook to check if a feature is locked
 * For conditional rendering without the gate component
 */
export function useIsFeatureLocked(featureKey: string): boolean {
  const featureConfig = getFeatureConfig(featureKey);
  const access = useFeatureAccess(featureKey, featureConfig.minPlan, featureConfig.requiresAdmin);
  return access.locked;
}

export default FeatureGate;

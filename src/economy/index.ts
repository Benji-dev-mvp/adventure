/**
 * Economic System Module
 * 
 * Tokenized task marketplace with credits, bidding,
 * and ROI-driven resource allocation.
 */

// Types
export * from './types';

// Core Systems
export { CreditManager, creditManager } from './CreditManager';
export { TaskMarketplace, taskMarketplace, type MarketplaceEvent, type MarketplaceEventHandler } from './TaskMarketplace';
export { ROIOptimizer, roiOptimizer, type OptimizationStrategy } from './ROIOptimizer';

// Convenience re-exports
export type {
  CreditAccount,
  CreditTier,
  CreditTransaction,
  CreditPricing,
  TaskListing,
  TaskType,
  TaskMarketStatus,
  TaskBid,
  TaskResult,
  TaskFeedback,
  AgentEconomics,
  AgentWallet,
  AgentReputation,
  ROIModel,
  ROIOptimizationResult,
  ResourceAllocation,
} from './types';

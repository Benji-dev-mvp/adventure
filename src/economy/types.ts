/**
 * Economic System Types
 *
 * Tokenized task marketplace with credits, bidding,
 * and ROI-driven resource allocation.
 */

// === Credit System ===

export interface CreditAccount {
  id: string;
  organizationId: string;
  balance: number;
  reserved: number;
  lifetime: {
    earned: number;
    spent: number;
    bonuses: number;
  };
  tier: CreditTier;
  rateLimit: RateLimit;
  createdAt: Date;
  updatedAt: Date;
}

export type CreditTier = 'starter' | 'growth' | 'scale' | 'enterprise' | 'unlimited';

export interface RateLimit {
  maxTasksPerHour: number;
  maxTasksPerDay: number;
  maxConcurrent: number;
  burstAllowance: number;
}

export interface CreditTransaction {
  id: string;
  accountId: string;
  type: 'purchase' | 'spend' | 'refund' | 'bonus' | 'transfer' | 'expire';
  amount: number;
  balance: number;
  reference: {
    type: 'task' | 'subscription' | 'achievement' | 'referral' | 'manual';
    id: string;
    description: string;
  };
  timestamp: Date;
}

export interface CreditPricing {
  taskType: string;
  baseCost: number;
  priorityMultiplier: number;
  qualityMultiplier: number;
  volumeDiscount: VolumeDiscount[];
}

export interface VolumeDiscount {
  minVolume: number;
  maxVolume: number;
  discountPercent: number;
}

// === Task Marketplace ===

export interface TaskListing {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  requirements: TaskRequirements;
  reward: TaskReward;
  deadline: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: TaskMarketStatus;
  createdBy: string;
  createdAt: Date;
  bids: TaskBid[];
  winnerId?: string;
  result?: TaskResult;
}

export type TaskType =
  | 'prospect-research'
  | 'email-generation'
  | 'sequence-creation'
  | 'reply-handling'
  | 'meeting-booking'
  | 'data-enrichment'
  | 'analysis'
  | 'optimization'
  | 'custom';

export type TaskMarketStatus =
  | 'open'
  | 'bidding'
  | 'assigned'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface TaskRequirements {
  skills: string[];
  minQualityScore: number;
  estimatedDuration: number;
  dataAccess: string[];
  constraints: Record<string, any>;
}

export interface TaskReward {
  credits: number;
  bonus?: {
    condition: string;
    amount: number;
  };
  reputationPoints: number;
}

export interface TaskBid {
  id: string;
  taskId: string;
  agentId: string;
  proposedCredits: number;
  estimatedDuration: number;
  confidence: number;
  approach: string;
  submittedAt: Date;
}

export interface TaskResult {
  taskId: string;
  agentId: string;
  output: any;
  metrics: {
    qualityScore: number;
    completionTime: number;
    creditsUsed: number;
    efficiency: number;
  };
  feedback?: TaskFeedback;
  completedAt: Date;
}

export interface TaskFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  review?: string;
  issues?: string[];
  improvementSuggestions?: string[];
}

// === Agent Economics ===

export interface AgentEconomics {
  agentId: string;
  wallet: AgentWallet;
  reputation: AgentReputation;
  performance: AgentPerformanceMetrics;
  specializations: AgentSpecialization[];
  pricing: AgentPricing;
}

export interface AgentWallet {
  balance: number;
  pendingEarnings: number;
  totalEarned: number;
  totalSpent: number;
  history: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'earn' | 'spend' | 'bonus' | 'penalty';
  amount: number;
  taskId?: string;
  description: string;
  timestamp: Date;
}

export interface AgentReputation {
  score: number;
  level: 'novice' | 'skilled' | 'expert' | 'master' | 'legendary';
  reviews: number;
  successRate: number;
  averageRating: number;
  badges: ReputationBadge[];
  history: ReputationEvent[];
}

export interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

export interface ReputationEvent {
  type: 'task-complete' | 'review' | 'badge' | 'penalty' | 'milestone';
  delta: number;
  reason: string;
  timestamp: Date;
}

export interface AgentPerformanceMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  averageCompletionTime: number;
  qualityScoreAvg: number;
  efficiencyScore: number;
  specializationScores: Record<string, number>;
}

export interface AgentSpecialization {
  domain: string;
  level: number;
  experiencePoints: number;
  certifications: string[];
}

export interface AgentPricing {
  baseRate: number;
  premiumMultiplier: number;
  discountRules: PricingRule[];
  minimumBid: number;
}

export interface PricingRule {
  condition: string;
  adjustment: number;
  type: 'percent' | 'flat';
}

// === ROI Optimization ===

export interface ROIModel {
  id: string;
  name: string;
  inputs: ROIInput[];
  outputs: ROIOutput[];
  formula: string;
  constraints: ROIConstraint[];
  lastUpdated: Date;
}

export interface ROIInput {
  name: string;
  type: 'credits' | 'time' | 'resources' | 'custom';
  value: number;
  unit: string;
  weight: number;
}

export interface ROIOutput {
  name: string;
  type: 'revenue' | 'meetings' | 'deals' | 'engagement' | 'custom';
  projected: number;
  confidence: number;
  unit: string;
}

export interface ROIConstraint {
  name: string;
  type: 'budget' | 'time' | 'capacity' | 'quality';
  min?: number;
  max?: number;
  current: number;
}

export interface ROIOptimizationResult {
  modelId: string;
  timestamp: Date;
  currentROI: number;
  optimizedROI: number;
  improvement: number;
  recommendations: ROIRecommendation[];
  allocation: ResourceAllocation;
  tradeoffs: ROITradeoff[];
}

export interface ROIRecommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: number;
  confidence: number;
  effort: 'low' | 'medium' | 'high';
  resources: string[];
}

export interface ResourceAllocation {
  budget: {
    total: number;
    byCategory: Record<string, number>;
    byAgent: Record<string, number>;
  };
  capacity: {
    total: number;
    utilized: number;
    byAgent: Record<string, number>;
  };
  priority: {
    weights: Record<string, number>;
    rules: AllocationRule[];
  };
}

export interface AllocationRule {
  condition: string;
  action: 'boost' | 'throttle' | 'redirect' | 'pause';
  target: string;
  magnitude: number;
}

export interface ROITradeoff {
  dimension1: string;
  dimension2: string;
  currentBalance: number;
  optimalBalance: number;
  recommendation: string;
}

// === Auction System ===

export interface Auction {
  id: string;
  type: 'first-price' | 'second-price' | 'dutch' | 'english';
  item: AuctionItem;
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  startTime: Date;
  endTime: Date;
  minBid: number;
  bidIncrement: number;
  bids: AuctionBid[];
  winner?: AuctionWinner;
}

export interface AuctionItem {
  type: 'task' | 'capacity' | 'priority' | 'resource';
  id: string;
  description: string;
  value: number;
  metadata: Record<string, any>;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'outbid' | 'withdrawn' | 'won';
}

export interface AuctionWinner {
  bidderId: string;
  winningBid: number;
  paidAmount: number;
  timestamp: Date;
}

// === Analytics ===

export interface EconomicMetrics {
  period: {
    start: Date;
    end: Date;
  };
  credits: {
    totalCirculating: number;
    velocity: number;
    distribution: Record<CreditTier, number>;
    burnRate: number;
  };
  marketplace: {
    totalListings: number;
    completedTasks: number;
    averageBidCount: number;
    averageCompletionTime: number;
    disputeRate: number;
  };
  agents: {
    activeCount: number;
    averageEarnings: number;
    topPerformers: string[];
    utilizationRate: number;
  };
  roi: {
    averageROI: number;
    topQuartileROI: number;
    bottomQuartileROI: number;
    improvementTrend: number;
  };
}

export interface EconomicEvent {
  id: string;
  type:
    | 'credit-purchase'
    | 'task-complete'
    | 'auction-end'
    | 'reputation-change'
    | 'allocation-update'
    | 'market-shift';
  data: Record<string, any>;
  impact: {
    credits: number;
    reputation: number;
    allocation: Record<string, number>;
  };
  timestamp: Date;
}

/**
 * Credit System
 * 
 * Manages tokenized credits for task execution,
 * with tiered accounts and transaction tracking.
 */

import type {
  CreditAccount,
  CreditTier,
  CreditTransaction,
  CreditPricing,
  RateLimit,
} from './types';

// === Tier Configurations ===

const TIER_CONFIGS: Record<CreditTier, {
  limits: RateLimit;
  discountPercent: number;
  bonusMultiplier: number;
}> = {
  starter: {
    limits: {
      maxTasksPerHour: 10,
      maxTasksPerDay: 100,
      maxConcurrent: 3,
      burstAllowance: 5,
    },
    discountPercent: 0,
    bonusMultiplier: 1,
  },
  growth: {
    limits: {
      maxTasksPerHour: 50,
      maxTasksPerDay: 500,
      maxConcurrent: 10,
      burstAllowance: 20,
    },
    discountPercent: 5,
    bonusMultiplier: 1.1,
  },
  scale: {
    limits: {
      maxTasksPerHour: 200,
      maxTasksPerDay: 2000,
      maxConcurrent: 25,
      burstAllowance: 50,
    },
    discountPercent: 10,
    bonusMultiplier: 1.2,
  },
  enterprise: {
    limits: {
      maxTasksPerHour: 1000,
      maxTasksPerDay: 10000,
      maxConcurrent: 100,
      burstAllowance: 200,
    },
    discountPercent: 20,
    bonusMultiplier: 1.5,
  },
  unlimited: {
    limits: {
      maxTasksPerHour: Infinity,
      maxTasksPerDay: Infinity,
      maxConcurrent: Infinity,
      burstAllowance: Infinity,
    },
    discountPercent: 25,
    bonusMultiplier: 2,
  },
};

// === Default Pricing ===

const DEFAULT_PRICING: CreditPricing[] = [
  {
    taskType: 'prospect-research',
    baseCost: 5,
    priorityMultiplier: 1.5,
    qualityMultiplier: 1.2,
    volumeDiscount: [
      { minVolume: 100, maxVolume: 500, discountPercent: 5 },
      { minVolume: 500, maxVolume: 2000, discountPercent: 10 },
      { minVolume: 2000, maxVolume: Infinity, discountPercent: 15 },
    ],
  },
  {
    taskType: 'email-generation',
    baseCost: 3,
    priorityMultiplier: 1.3,
    qualityMultiplier: 1.5,
    volumeDiscount: [
      { minVolume: 100, maxVolume: 500, discountPercent: 5 },
      { minVolume: 500, maxVolume: 2000, discountPercent: 10 },
      { minVolume: 2000, maxVolume: Infinity, discountPercent: 15 },
    ],
  },
  {
    taskType: 'sequence-creation',
    baseCost: 25,
    priorityMultiplier: 1.2,
    qualityMultiplier: 1.3,
    volumeDiscount: [
      { minVolume: 10, maxVolume: 50, discountPercent: 5 },
      { minVolume: 50, maxVolume: 200, discountPercent: 10 },
      { minVolume: 200, maxVolume: Infinity, discountPercent: 15 },
    ],
  },
  {
    taskType: 'reply-handling',
    baseCost: 8,
    priorityMultiplier: 2.0,
    qualityMultiplier: 1.4,
    volumeDiscount: [
      { minVolume: 50, maxVolume: 200, discountPercent: 5 },
      { minVolume: 200, maxVolume: 1000, discountPercent: 10 },
      { minVolume: 1000, maxVolume: Infinity, discountPercent: 15 },
    ],
  },
  {
    taskType: 'meeting-booking',
    baseCost: 15,
    priorityMultiplier: 2.5,
    qualityMultiplier: 1.1,
    volumeDiscount: [
      { minVolume: 20, maxVolume: 100, discountPercent: 5 },
      { minVolume: 100, maxVolume: 500, discountPercent: 10 },
      { minVolume: 500, maxVolume: Infinity, discountPercent: 15 },
    ],
  },
  {
    taskType: 'data-enrichment',
    baseCost: 2,
    priorityMultiplier: 1.2,
    qualityMultiplier: 1.3,
    volumeDiscount: [
      { minVolume: 500, maxVolume: 2000, discountPercent: 10 },
      { minVolume: 2000, maxVolume: 10000, discountPercent: 20 },
      { minVolume: 10000, maxVolume: Infinity, discountPercent: 30 },
    ],
  },
  {
    taskType: 'analysis',
    baseCost: 20,
    priorityMultiplier: 1.3,
    qualityMultiplier: 1.5,
    volumeDiscount: [
      { minVolume: 10, maxVolume: 50, discountPercent: 5 },
      { minVolume: 50, maxVolume: 200, discountPercent: 10 },
      { minVolume: 200, maxVolume: Infinity, discountPercent: 15 },
    ],
  },
  {
    taskType: 'optimization',
    baseCost: 30,
    priorityMultiplier: 1.4,
    qualityMultiplier: 1.6,
    volumeDiscount: [
      { minVolume: 5, maxVolume: 20, discountPercent: 5 },
      { minVolume: 20, maxVolume: 100, discountPercent: 10 },
      { minVolume: 100, maxVolume: Infinity, discountPercent: 15 },
    ],
  },
];

// === Credit Manager ===

export class CreditManager {
  private accounts: Map<string, CreditAccount> = new Map();
  private transactions: CreditTransaction[] = [];
  private pricing: CreditPricing[] = DEFAULT_PRICING;

  /**
   * Create a new credit account
   */
  createAccount(
    organizationId: string,
    tier: CreditTier = 'starter',
    initialBalance: number = 0
  ): CreditAccount {
    const id = `acc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tierConfig = TIER_CONFIGS[tier];

    const account: CreditAccount = {
      id,
      organizationId,
      balance: initialBalance,
      reserved: 0,
      lifetime: {
        earned: initialBalance,
        spent: 0,
        bonuses: 0,
      },
      tier,
      rateLimit: tierConfig.limits,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.accounts.set(id, account);
    
    if (initialBalance > 0) {
      this.recordTransaction(id, 'purchase', initialBalance, 'Initial balance');
    }

    return account;
  }

  /**
   * Get account by ID
   */
  getAccount(id: string): CreditAccount | undefined {
    return this.accounts.get(id);
  }

  /**
   * Get account by organization
   */
  getAccountByOrg(organizationId: string): CreditAccount | undefined {
    return Array.from(this.accounts.values()).find(
      a => a.organizationId === organizationId
    );
  }

  /**
   * Add credits to account
   */
  addCredits(
    accountId: string,
    amount: number,
    type: 'purchase' | 'bonus' | 'refund' = 'purchase',
    description: string = ''
  ): boolean {
    const account = this.accounts.get(accountId);
    if (!account) return false;

    const tierConfig = TIER_CONFIGS[account.tier];
    let adjustedAmount = amount;

    // Apply tier bonus for earned credits
    if (type === 'bonus') {
      adjustedAmount = amount * tierConfig.bonusMultiplier;
      account.lifetime.bonuses += adjustedAmount;
    }

    account.balance += adjustedAmount;
    account.lifetime.earned += adjustedAmount;
    account.updatedAt = new Date();

    this.recordTransaction(accountId, type, adjustedAmount, description);
    return true;
  }

  /**
   * Spend credits from account
   */
  spendCredits(
    accountId: string,
    amount: number,
    taskId: string,
    description: string = ''
  ): boolean {
    const account = this.accounts.get(accountId);
    if (!account || account.balance < amount) return false;

    account.balance -= amount;
    account.lifetime.spent += amount;
    account.updatedAt = new Date();

    this.recordTransaction(accountId, 'spend', -amount, description, taskId);
    return true;
  }

  /**
   * Reserve credits for a pending task
   */
  reserveCredits(accountId: string, amount: number): boolean {
    const account = this.accounts.get(accountId);
    if (!account || account.balance - account.reserved < amount) return false;

    account.reserved += amount;
    account.updatedAt = new Date();
    return true;
  }

  /**
   * Release reserved credits
   */
  releaseReservation(accountId: string, amount: number): void {
    const account = this.accounts.get(accountId);
    if (!account) return;

    account.reserved = Math.max(0, account.reserved - amount);
    account.updatedAt = new Date();
  }

  /**
   * Calculate task cost
   */
  calculateCost(
    taskType: string,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      quality?: 'standard' | 'premium';
      volume?: number;
      accountId?: string;
    } = {}
  ): number {
    const pricing = this.pricing.find(p => p.taskType === taskType);
    if (!pricing) {
      // Default pricing for unknown task types
      return 10;
    }

    let cost = pricing.baseCost;

    // Priority multiplier
    if (options.priority === 'high') {
      cost *= pricing.priorityMultiplier * 0.7;
    } else if (options.priority === 'urgent') {
      cost *= pricing.priorityMultiplier;
    }

    // Quality multiplier
    if (options.quality === 'premium') {
      cost *= pricing.qualityMultiplier;
    }

    // Volume discount
    if (options.volume && options.volume > 0) {
      const discount = pricing.volumeDiscount.find(
        d => options.volume! >= d.minVolume && options.volume! < d.maxVolume
      );
      if (discount) {
        cost *= 1 - discount.discountPercent / 100;
      }
    }

    // Tier discount
    if (options.accountId) {
      const account = this.accounts.get(options.accountId);
      if (account) {
        const tierConfig = TIER_CONFIGS[account.tier];
        cost *= 1 - tierConfig.discountPercent / 100;
      }
    }

    return Math.ceil(cost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Check rate limits
   */
  checkRateLimit(
    accountId: string,
    tasksLastHour: number,
    tasksToday: number,
    currentConcurrent: number
  ): {
    allowed: boolean;
    reason?: string;
    waitTime?: number;
  } {
    const account = this.accounts.get(accountId);
    if (!account) {
      return { allowed: false, reason: 'Account not found' };
    }

    const { rateLimit } = account;

    if (currentConcurrent >= rateLimit.maxConcurrent) {
      return {
        allowed: false,
        reason: 'Max concurrent tasks reached',
        waitTime: 60,
      };
    }

    if (tasksLastHour >= rateLimit.maxTasksPerHour) {
      // Check burst allowance
      if (tasksLastHour - rateLimit.maxTasksPerHour < rateLimit.burstAllowance) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'Hourly limit reached',
        waitTime: 3600,
      };
    }

    if (tasksToday >= rateLimit.maxTasksPerDay) {
      return {
        allowed: false,
        reason: 'Daily limit reached',
        waitTime: 86400,
      };
    }

    return { allowed: true };
  }

  /**
   * Upgrade account tier
   */
  upgradeTier(accountId: string, newTier: CreditTier): boolean {
    const account = this.accounts.get(accountId);
    if (!account) return false;

    const tierOrder: CreditTier[] = ['starter', 'growth', 'scale', 'enterprise', 'unlimited'];
    const currentIndex = tierOrder.indexOf(account.tier);
    const newIndex = tierOrder.indexOf(newTier);

    if (newIndex <= currentIndex) return false;

    account.tier = newTier;
    account.rateLimit = TIER_CONFIGS[newTier].limits;
    account.updatedAt = new Date();

    return true;
  }

  /**
   * Get transaction history
   */
  getTransactions(
    accountId: string,
    options: {
      limit?: number;
      type?: CreditTransaction['type'];
      since?: Date;
    } = {}
  ): CreditTransaction[] {
    let txns = this.transactions.filter(t => 
      t.accountId === accountId
    );

    if (options.type) {
      txns = txns.filter(t => t.type === options.type);
    }

    if (options.since) {
      txns = txns.filter(t => t.timestamp >= options.since!);
    }

    txns = txns.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (options.limit) {
      txns = txns.slice(0, options.limit);
    }

    return txns;
  }

  /**
   * Get spending analytics
   */
  getSpendingAnalytics(
    accountId: string,
    period: { start: Date; end: Date }
  ): {
    totalSpent: number;
    byTaskType: Record<string, number>;
    byDay: Array<{ date: string; amount: number }>;
    averagePerTask: number;
    topExpenses: Array<{ taskType: string; amount: number; count: number }>;
  } {
    const txns = this.transactions.filter(
      t => t.accountId === accountId &&
           t.type === 'spend' &&
           t.timestamp >= period.start &&
           t.timestamp <= period.end
    );

    const totalSpent = txns.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const byTaskType: Record<string, number> = {};
    const taskCounts: Record<string, number> = {};
    const byDayMap: Record<string, number> = {};

    for (const txn of txns) {
      const taskType = txn.reference.type;
      byTaskType[taskType] = (byTaskType[taskType] || 0) + Math.abs(txn.amount);
      taskCounts[taskType] = (taskCounts[taskType] || 0) + 1;

      const dateStr = txn.timestamp.toISOString().split('T')[0];
      byDayMap[dateStr] = (byDayMap[dateStr] || 0) + Math.abs(txn.amount);
    }

    const byDay = Object.entries(byDayMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topExpenses = Object.entries(byTaskType)
      .map(([taskType, amount]) => ({
        taskType,
        amount,
        count: taskCounts[taskType] || 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalSpent,
      byTaskType,
      byDay,
      averagePerTask: txns.length > 0 ? totalSpent / txns.length : 0,
      topExpenses,
    };
  }

  /**
   * Record a transaction
   */
  private recordTransaction(
    accountId: string,
    type: CreditTransaction['type'],
    amount: number,
    description: string,
    referenceId?: string
  ): void {
    const account = this.accounts.get(accountId);
    if (!account) return;

    const txn: CreditTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      accountId,
      type,
      amount,
      balance: account.balance,
      reference: {
        type: 'task',
        id: referenceId || '',
        description,
      },
      timestamp: new Date(),
    };

    this.transactions.push(txn);
  }

  /**
   * Update pricing
   */
  updatePricing(taskType: string, pricing: Partial<CreditPricing>): void {
    const existing = this.pricing.find(p => p.taskType === taskType);
    if (existing) {
      Object.assign(existing, pricing);
    } else {
      this.pricing.push({
        taskType,
        baseCost: pricing.baseCost || 10,
        priorityMultiplier: pricing.priorityMultiplier || 1.5,
        qualityMultiplier: pricing.qualityMultiplier || 1.2,
        volumeDiscount: pricing.volumeDiscount || [],
      });
    }
  }

  /**
   * Get current pricing
   */
  getPricing(): CreditPricing[] {
    return [...this.pricing];
  }
}

// Singleton export
export const creditManager = new CreditManager();
export default CreditManager;

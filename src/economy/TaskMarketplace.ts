/**
 * Task Marketplace
 * 
 * Decentralized marketplace for task listing, bidding,
 * assignment, and fulfillment between agents.
 */

import type {
  TaskListing,
  TaskType,
  TaskMarketStatus,
  TaskRequirements,
  TaskReward,
  TaskBid,
  TaskResult,
  TaskFeedback,
} from './types';

// === Marketplace Events ===

export type MarketplaceEvent =
  | { type: 'task-listed'; task: TaskListing }
  | { type: 'bid-submitted'; taskId: string; bid: TaskBid }
  | { type: 'task-assigned'; taskId: string; agentId: string }
  | { type: 'task-started'; taskId: string }
  | { type: 'task-completed'; taskId: string; result: TaskResult }
  | { type: 'task-disputed'; taskId: string; reason: string }
  | { type: 'task-cancelled'; taskId: string };

export type MarketplaceEventHandler = (event: MarketplaceEvent) => void;

// === Marketplace Manager ===

export class TaskMarketplace {
  private listings: Map<string, TaskListing> = new Map();
  private bids: Map<string, TaskBid[]> = new Map();
  private eventHandlers: Set<MarketplaceEventHandler> = new Set();

  /**
   * List a new task on the marketplace
   */
  listTask(params: {
    type: TaskType;
    title: string;
    description: string;
    requirements: TaskRequirements;
    reward: TaskReward;
    deadline: Date;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    createdBy: string;
  }): TaskListing {
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const listing: TaskListing = {
      id,
      type: params.type,
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      reward: params.reward,
      deadline: params.deadline,
      priority: params.priority || 'normal',
      status: 'open',
      createdBy: params.createdBy,
      createdAt: new Date(),
      bids: [],
    };

    this.listings.set(id, listing);
    this.bids.set(id, []);
    this.emit({ type: 'task-listed', task: listing });

    return listing;
  }

  /**
   * Submit a bid for a task
   */
  submitBid(params: {
    taskId: string;
    agentId: string;
    proposedCredits: number;
    estimatedDuration: number;
    confidence: number;
    approach: string;
  }): TaskBid | null {
    const listing = this.listings.get(params.taskId);
    if (!listing || listing.status !== 'open' && listing.status !== 'bidding') {
      return null;
    }

    // Check if agent already bid
    const existingBids = this.bids.get(params.taskId) || [];
    if (existingBids.some(b => b.agentId === params.agentId)) {
      return null; // Agent already bid
    }

    const bid: TaskBid = {
      id: `bid_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      taskId: params.taskId,
      agentId: params.agentId,
      proposedCredits: params.proposedCredits,
      estimatedDuration: params.estimatedDuration,
      confidence: params.confidence,
      approach: params.approach,
      submittedAt: new Date(),
    };

    existingBids.push(bid);
    this.bids.set(params.taskId, existingBids);
    listing.bids = existingBids;
    listing.status = 'bidding';

    this.emit({ type: 'bid-submitted', taskId: params.taskId, bid });

    return bid;
  }

  /**
   * Automatically select winning bid
   */
  selectWinner(taskId: string, strategy: 'lowest' | 'highest-confidence' | 'balanced' = 'balanced'): TaskBid | null {
    const listing = this.listings.get(taskId);
    const bids = this.bids.get(taskId);
    
    if (!listing || !bids || bids.length === 0) return null;

    let winner: TaskBid;

    switch (strategy) {
      case 'lowest':
        winner = bids.reduce((min, b) => 
          b.proposedCredits < min.proposedCredits ? b : min,
          bids[0]
        );
        break;

      case 'highest-confidence':
        winner = bids.reduce((max, b) => 
          b.confidence > max.confidence ? b : max,
          bids[0]
        );
        break;

      case 'balanced':
      default:
        // Score = confidence * 0.5 + (1 - normalized_cost) * 0.3 + speed * 0.2
        const maxCost = Math.max(...bids.map(b => b.proposedCredits));
        const maxDuration = Math.max(...bids.map(b => b.estimatedDuration));

        winner = bids.reduce((best, b) => {
          const costScore = 1 - b.proposedCredits / (maxCost || 1);
          const speedScore = 1 - b.estimatedDuration / (maxDuration || 1);
          const score = b.confidence * 0.5 + costScore * 0.3 + speedScore * 0.2;
          
          const bestCostScore = 1 - best.proposedCredits / (maxCost || 1);
          const bestSpeedScore = 1 - best.estimatedDuration / (maxDuration || 1);
          const bestScore = best.confidence * 0.5 + bestCostScore * 0.3 + bestSpeedScore * 0.2;
          
          return score > bestScore ? b : best;
        });
    }

    this.assignTask(taskId, winner.agentId);
    return winner;
  }

  /**
   * Manually assign task to agent
   */
  assignTask(taskId: string, agentId: string): boolean {
    const listing = this.listings.get(taskId);
    if (!listing) return false;

    listing.status = 'assigned';
    listing.winnerId = agentId;

    this.emit({ type: 'task-assigned', taskId, agentId });
    return true;
  }

  /**
   * Start task execution
   */
  startTask(taskId: string): boolean {
    const listing = this.listings.get(taskId);
    if (!listing || listing.status !== 'assigned') return false;

    listing.status = 'in-progress';
    this.emit({ type: 'task-started', taskId });
    return true;
  }

  /**
   * Complete a task
   */
  completeTask(taskId: string, result: Omit<TaskResult, 'taskId' | 'completedAt'>): boolean {
    const listing = this.listings.get(taskId);
    if (!listing || listing.status !== 'in-progress') return false;

    const fullResult: TaskResult = {
      ...result,
      taskId,
      completedAt: new Date(),
    };

    listing.status = 'completed';
    listing.result = fullResult;

    this.emit({ type: 'task-completed', taskId, result: fullResult });
    return true;
  }

  /**
   * Submit feedback for completed task
   */
  submitFeedback(taskId: string, feedback: TaskFeedback): boolean {
    const listing = this.listings.get(taskId);
    if (!listing || !listing.result) return false;

    listing.result.feedback = feedback;
    return true;
  }

  /**
   * Dispute a task result
   */
  disputeTask(taskId: string, reason: string): boolean {
    const listing = this.listings.get(taskId);
    if (!listing) return false;

    listing.status = 'disputed';
    this.emit({ type: 'task-disputed', taskId, reason });
    return true;
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): boolean {
    const listing = this.listings.get(taskId);
    if (!listing) return false;

    if (listing.status === 'in-progress' || listing.status === 'completed') {
      return false; // Cannot cancel in-progress or completed tasks
    }

    listing.status = 'cancelled';
    this.emit({ type: 'task-cancelled', taskId });
    return true;
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): TaskListing | undefined {
    return this.listings.get(taskId);
  }

  /**
   * Search tasks
   */
  searchTasks(filters: {
    type?: TaskType;
    status?: TaskMarketStatus;
    minReward?: number;
    maxDeadline?: Date;
    skills?: string[];
    createdBy?: string;
  }): TaskListing[] {
    let results = Array.from(this.listings.values());

    if (filters.type) {
      results = results.filter(t => t.type === filters.type);
    }

    if (filters.status) {
      results = results.filter(t => t.status === filters.status);
    }

    if (filters.minReward !== undefined) {
      results = results.filter(t => t.reward.credits >= filters.minReward!);
    }

    if (filters.maxDeadline) {
      results = results.filter(t => t.deadline <= filters.maxDeadline!);
    }

    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(t => 
        filters.skills!.some(s => t.requirements.skills.includes(s))
      );
    }

    if (filters.createdBy) {
      results = results.filter(t => t.createdBy === filters.createdBy);
    }

    return results;
  }

  /**
   * Get available tasks for an agent
   */
  getAvailableTasks(agentId: string, agentSkills: string[]): TaskListing[] {
    return this.searchTasks({ status: 'open' })
      .concat(this.searchTasks({ status: 'bidding' }))
      .filter(task => {
        // Check if agent already bid
        const taskBids = this.bids.get(task.id) || [];
        if (taskBids.some(b => b.agentId === agentId)) {
          return false;
        }

        // Check skill match
        const requiredSkills = task.requirements.skills;
        const hasRequiredSkills = requiredSkills.some(s => agentSkills.includes(s));
        
        return hasRequiredSkills;
      })
      .sort((a, b) => {
        // Sort by priority, then reward
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.reward.credits - a.reward.credits;
      });
  }

  /**
   * Get marketplace statistics
   */
  getStats(): {
    totalListings: number;
    openTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalBids: number;
    averageBidsPerTask: number;
    averageReward: number;
    completionRate: number;
  } {
    const all = Array.from(this.listings.values());
    const open = all.filter(t => t.status === 'open' || t.status === 'bidding');
    const inProgress = all.filter(t => t.status === 'in-progress' || t.status === 'assigned');
    const completed = all.filter(t => t.status === 'completed');
    const cancelled = all.filter(t => t.status === 'cancelled' || t.status === 'disputed');

    const totalBids = Array.from(this.bids.values()).reduce(
      (sum, bids) => sum + bids.length,
      0
    );

    const tasksWithBids = Array.from(this.bids.values()).filter(b => b.length > 0).length;

    const totalReward = all.reduce((sum, t) => sum + t.reward.credits, 0);

    return {
      totalListings: all.length,
      openTasks: open.length,
      inProgressTasks: inProgress.length,
      completedTasks: completed.length,
      totalBids,
      averageBidsPerTask: tasksWithBids > 0 ? totalBids / tasksWithBids : 0,
      averageReward: all.length > 0 ? totalReward / all.length : 0,
      completionRate: all.length > 0 
        ? completed.length / (completed.length + cancelled.length) 
        : 1,
    };
  }

  /**
   * Subscribe to marketplace events
   */
  subscribe(handler: MarketplaceEventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  /**
   * Emit event to all subscribers
   */
  private emit(event: MarketplaceEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (error) {
        console.error('Marketplace event handler error:', error);
      }
    }
  }

  /**
   * Get tasks by agent
   */
  getAgentTasks(agentId: string): {
    assigned: TaskListing[];
    completed: TaskListing[];
    totalEarned: number;
    averageRating: number;
  } {
    const all = Array.from(this.listings.values());
    
    const assigned = all.filter(
      t => t.winnerId === agentId && 
           (t.status === 'assigned' || t.status === 'in-progress')
    );
    
    const completed = all.filter(
      t => t.winnerId === agentId && t.status === 'completed'
    );
    
    const totalEarned = completed.reduce((sum, t) => {
      const bid = t.bids.find(b => b.agentId === agentId);
      return sum + (bid?.proposedCredits || t.reward.credits);
    }, 0);
    
    const ratings = completed
      .map(t => t.result?.feedback?.rating)
      .filter((r): r is 1 | 2 | 3 | 4 | 5 => r !== undefined);
    
    const averageRating = ratings.length > 0
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      : 0;

    return {
      assigned,
      completed,
      totalEarned,
      averageRating,
    };
  }

  /**
   * Cleanup expired tasks
   */
  cleanupExpired(): number {
    const now = new Date();
    let cleaned = 0;

    for (const [id, task] of this.listings) {
      if (task.deadline < now && 
          (task.status === 'open' || task.status === 'bidding')) {
        task.status = 'cancelled';
        this.emit({ type: 'task-cancelled', taskId: id });
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton export
export const taskMarketplace = new TaskMarketplace();
export default TaskMarketplace;

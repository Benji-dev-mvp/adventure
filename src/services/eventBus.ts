/**
 * Event Bus - Single source of truth for all events
 * Used by simulationEngine, command handlers, and UI interactions
 * ActivityStream and ExecutionTimeline both consume from here
 */

import { ActivityEvent } from '@/contracts/activity';

type EventListener = (event: ActivityEvent) => void;

class EventBus {
  private listeners: Set<EventListener> = new Set();
  private eventHistory: ActivityEvent[] = [];
  private maxHistorySize = 1000;

  /**
   * Subscribe to all events
   */
  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Emit an event to all subscribers
   */
  emit(event: ActivityEvent): void {
    // Add to history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(0, this.maxHistorySize);
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  /**
   * Get event history (most recent first)
   */
  getHistory(limit?: number): ActivityEvent[] {
    return limit ? this.eventHistory.slice(0, limit) : [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get events filtered by criteria
   */
  getFilteredHistory(filter: {
    actorType?: ActivityEvent['actorType'];
    importance?: ActivityEvent['importance'];
    entityType?: ActivityEvent['entityType'];
    since?: Date;
  }): ActivityEvent[] {
    let filtered = this.eventHistory;

    if (filter.actorType) {
      filtered = filtered.filter(e => e.actorType === filter.actorType);
    }

    if (filter.importance) {
      filtered = filtered.filter(e => e.importance === filter.importance);
    }

    if (filter.entityType) {
      filtered = filtered.filter(e => e.entityType === filter.entityType);
    }

    if (filter.since) {
      const sinceTime = filter.since.getTime();
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= sinceTime);
    }

    return filtered;
  }
}

// Global singleton
export const eventBus = new EventBus();

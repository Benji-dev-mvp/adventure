/**
 * Playbook Intelligence Components
 * 
 * Phase 1 - Visual Intelligence Layer Foundation
 * 
 * These components transform playbooks from simple lists into
 * a visual intelligence control surface.
 */

export { PlaybookHealthHeatmap } from './PlaybookHealthHeatmap';
export { PlaybookRunTimeline } from './PlaybookRunTimeline';
export { StrategyRecommendationCards } from './StrategyRecommendationCards';
export { PlaybookAttributionMatrix } from './PlaybookAttributionMatrix';
export { PlaybookAnalyticsPanel } from './PlaybookAnalyticsPanel';

// Re-export all as a namespace for convenience
import { PlaybookHealthHeatmap } from './PlaybookHealthHeatmap';
import { PlaybookRunTimeline } from './PlaybookRunTimeline';
import { StrategyRecommendationCards } from './StrategyRecommendationCards';
import { PlaybookAttributionMatrix } from './PlaybookAttributionMatrix';
import { PlaybookAnalyticsPanel } from './PlaybookAnalyticsPanel';

export const PlaybookIntelligence = {
  HealthHeatmap: PlaybookHealthHeatmap,
  RunTimeline: PlaybookRunTimeline,
  StrategyCards: StrategyRecommendationCards,
  AttributionMatrix: PlaybookAttributionMatrix,
  AnalyticsPanel: PlaybookAnalyticsPanel,
};

export default PlaybookIntelligence;

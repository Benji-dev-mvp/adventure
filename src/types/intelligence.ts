/**
 * Intelligence Layer Types
 * Types for the system brain - account graphs, influence maps, and proactive intelligence
 */

// ============================================
// Account Intelligence Graph Types
// ============================================

export type NodeType = 'account' | 'contact' | 'technology' | 'signal' | 'campaign' | 'deal';
export type EdgeType = 'works_at' | 'uses' | 'triggered' | 'engaged_with' | 'connected_to' | 'influenced_by';
export type IntentLevel = 'hot' | 'warm' | 'cold' | 'unknown';
export type FitScore = 'excellent' | 'good' | 'moderate' | 'poor';
export type StageType = 'prospect' | 'engaged' | 'qualified' | 'opportunity' | 'customer';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  data: AccountNodeData | ContactNodeData | TechnologyNodeData | SignalData;
  position: { x: number; y: number };
  cluster?: string;
  intentLevel: IntentLevel;
  fitScore: FitScore;
  stage: StageType;
  score: number;
  lastActivity: Date;
  metadata: Record<string, any>;
}

export interface AccountNodeData {
  companyName: string;
  domain: string;
  industry: string;
  employeeCount: number;
  revenue: string;
  technologies: string[];
  signals: SignalData[];
  contacts: string[]; // contact node IDs
  engagementScore: number;
}

export interface ContactNodeData {
  name: string;
  title: string;
  email: string;
  linkedin?: string;
  seniority: string;
  department: string;
  accountId: string;
  influence: number;
  engagement: number;
  lastContactedAt?: Date;
}

export interface TechnologyNodeData {
  name: string;
  category: string;
  marketShare: number;
  competitors: string[];
  integrations: string[];
}

export interface SignalData {
  type: 'hiring' | 'funding' | 'product_launch' | 'leadership_change' | 'expansion' | 'tech_adoption' | 'content_engagement';
  title: string;
  description: string;
  strength: number;
  timestamp: Date;
  source: string;
  url?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  label?: string;
  animated?: boolean;
  metadata?: Record<string, any>;
}

export interface IntelligenceGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters: GraphCluster[];
  metadata: GraphMetadata;
}

export interface GraphCluster {
  id: string;
  name: string;
  color: string;
  nodeIds: string[];
  centroid: { x: number; y: number };
  description: string;
}

export interface GraphMetadata {
  totalNodes: number;
  totalEdges: number;
  lastUpdated: Date;
  coverageScore: number;
  dataQuality: number;
}

// ============================================
// Influence Map Types
// ============================================

export type StakeholderRole = 'decision_maker' | 'champion' | 'influencer' | 'blocker' | 'end_user' | 'evaluator';
export type RelationshipStrength = 'strong' | 'moderate' | 'weak' | 'unknown';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'unknown';

export interface Stakeholder {
  id: string;
  contactId: string;
  name: string;
  title: string;
  role: StakeholderRole;
  influence: number; // 0-100
  accessLevel: number; // 0-100
  sentiment: Sentiment;
  engagementScore: number;
  lastInteraction?: Date;
  notes: string[];
  avatar?: string;
}

export interface StakeholderRelationship {
  id: string;
  fromId: string;
  toId: string;
  type: 'reports_to' | 'peers_with' | 'influences' | 'blocks' | 'sponsors';
  strength: RelationshipStrength;
  confidence: number;
  notes?: string;
}

export interface InfluenceMap {
  accountId: string;
  accountName: string;
  stakeholders: Stakeholder[];
  relationships: StakeholderRelationship[];
  buyingCenter: BuyingCenter;
  recommendations: InfluenceRecommendation[];
  lastUpdated: Date;
}

export interface BuyingCenter {
  economicBuyer?: string;
  technicalBuyer?: string;
  userBuyer?: string;
  champion?: string;
  coach?: string;
  blockers: string[];
  missingRoles: StakeholderRole[];
}

export interface InfluenceRecommendation {
  id: string;
  type: 'engage' | 'nurture' | 'neutralize' | 'expand' | 'identify';
  target?: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  suggestedAction: string;
}

// ============================================
// Proactive Intelligence Types
// ============================================

export type InsightType = 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'recommendation';
export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ProactiveInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  evidence: Evidence[];
  suggestedActions: SuggestedAction[];
  affectedEntities: string[];
  expiresAt?: Date;
  createdAt: Date;
  isActioned: boolean;
  dismissedAt?: Date;
}

export interface Evidence {
  type: 'data' | 'pattern' | 'comparison' | 'prediction';
  description: string;
  value: any;
  confidence: number;
  source: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
  description: string;
  actionType: 'navigate' | 'execute' | 'schedule' | 'notify';
  payload: Record<string, any>;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface IntelligenceFeed {
  insights: ProactiveInsight[];
  unreadCount: number;
  criticalCount: number;
  lastChecked: Date;
  preferences: IntelligencePreferences;
}

export interface IntelligencePreferences {
  enabledTypes: InsightType[];
  minPriority: InsightPriority;
  notificationChannels: ('in_app' | 'email' | 'slack')[];
  digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

// ============================================
// Intelligence Search & Query Types
// ============================================

export interface IntelligenceQuery {
  type: 'natural' | 'structured';
  query: string;
  filters?: IntelligenceFilters;
  context?: Record<string, any>;
}

export interface IntelligenceFilters {
  nodeTypes?: NodeType[];
  intentLevels?: IntentLevel[];
  fitScores?: FitScore[];
  stages?: StageType[];
  dateRange?: { start: Date; end: Date };
  clusters?: string[];
  minScore?: number;
}

export interface IntelligenceSearchResult {
  query: IntelligenceQuery;
  results: GraphNode[];
  totalCount: number;
  clusters: GraphCluster[];
  relatedInsights: ProactiveInsight[];
  searchTime: number;
}

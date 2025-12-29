/**
 * AI Capabilities Contract
 * 
 * Segment-based AI capability model that explicitly differentiates
 * Startup vs Midmarket vs Enterprise in terms of:
 * - Autonomy levels available
 * - Governance and approval policies
 * - Risk tolerance and sampling
 * - Explainability features
 * - Admin controls
 * 
 * This contract drives UI behavior: what's shown, what's locked, and how AI behaves per segment.
 */

import { PlanTier } from '../demo/demoData';
import { AIRiskLevel, AIAutonomyMode, AIDecisionType } from './ai';

// ============================================================================
// CAPABILITY MODEL
// ============================================================================

export interface AICapabilities {
  // Core autonomy
  autonomyModes: {
    available: AIAutonomyMode[];
    maxLevel: AIAutonomyMode;
    default: AIAutonomyMode;
  };
  
  // Approval policy
  approvalPolicy: {
    requiresApprovalByRisk: Record<AIRiskLevel, boolean>;
    requiresApprovalByType: Partial<Record<AIDecisionType, boolean>>;
    samplingRate?: number; // 0-100, for enterprise: audit sample % of auto-approved decisions
    allowBypass: boolean; // Can user override approval requirement?
  };
  
  // Governance & explainability
  governance: {
    whyDrawerEnabled: boolean; // Can user see AI explanation drawer?
    decisionHistoryEnabled: boolean; // Can user see full decision log?
    revertEnabled: boolean; // Can user revert AI decisions?
    auditTrailEnabled: boolean; // Full audit trail with who/when/why
    confidenceThresholdsConfigurable: boolean; // Can admin set minimum confidence?
  };
  
  // Decision limits
  limits: {
    maxDecisionsPerDay: number;
    maxBatchSize: number; // Max entities affected by single decision
    allowSystemWideDecisions: boolean;
  };
  
  // Risk tolerance
  riskTolerance: {
    allowedRiskLevels: AIRiskLevel[];
    requireReviewAboveConfidence?: number; // If set, confidence < this requires review
    autoBlockCriticalRisk: boolean;
  };
  
  // UI features
  uiFeatures: {
    showConfidenceScores: boolean;
    showAlternatives: boolean;
    showImpactPrediction: boolean;
    allowManualOverride: boolean;
    showProvenanceDetails: boolean;
  };
  
  // Badge display
  badgeText?: string; // e.g., "AI Assist", "AI Autopilot", "AI Governed"
}

// ============================================================================
// SEGMENT-SPECIFIC CAPABILITIES
// ============================================================================

export const AI_CAPABILITIES_BY_PLAN: Record<PlanTier, AICapabilities> = {
  startup: {
    autonomyModes: {
      available: ['off', 'assist'],
      maxLevel: 'assist',
      default: 'assist',
    },
    approvalPolicy: {
      requiresApprovalByRisk: {
        low: false,
        medium: true,
        high: true,
        critical: true,
      },
      requiresApprovalByType: {
        lead_qualification: false,
        campaign_optimization: true,
        outreach_timing: false,
        message_generation: true,
        lead_scoring: false,
        playbook_execution: true,
        resource_allocation: true,
        priority_adjustment: true,
        workflow_automation: true,
      },
      allowBypass: false,
    },
    governance: {
      whyDrawerEnabled: true,
      decisionHistoryEnabled: true,
      revertEnabled: true,
      auditTrailEnabled: false,
      confidenceThresholdsConfigurable: false,
    },
    limits: {
      maxDecisionsPerDay: 100,
      maxBatchSize: 50,
      allowSystemWideDecisions: false,
    },
    riskTolerance: {
      allowedRiskLevels: ['low', 'medium'],
      requireReviewAboveConfidence: 80,
      autoBlockCriticalRisk: true,
    },
    uiFeatures: {
      showConfidenceScores: true,
      showAlternatives: false,
      showImpactPrediction: true,
      allowManualOverride: true,
      showProvenanceDetails: false,
    },
    badgeText: 'AI Assist',
  },
  
  midmarket: {
    autonomyModes: {
      available: ['off', 'assist', 'autopilot'],
      maxLevel: 'autopilot',
      default: 'assist',
    },
    approvalPolicy: {
      requiresApprovalByRisk: {
        low: false,
        medium: false,
        high: true,
        critical: true,
      },
      requiresApprovalByType: {
        lead_qualification: false,
        campaign_optimization: false,
        outreach_timing: false,
        message_generation: false,
        lead_scoring: false,
        playbook_execution: true,
        resource_allocation: true,
        priority_adjustment: false,
        workflow_automation: true,
      },
      allowBypass: false,
    },
    governance: {
      whyDrawerEnabled: true,
      decisionHistoryEnabled: true,
      revertEnabled: true,
      auditTrailEnabled: true,
      confidenceThresholdsConfigurable: false,
    },
    limits: {
      maxDecisionsPerDay: 500,
      maxBatchSize: 200,
      allowSystemWideDecisions: false,
    },
    riskTolerance: {
      allowedRiskLevels: ['low', 'medium', 'high'],
      requireReviewAboveConfidence: 70,
      autoBlockCriticalRisk: true,
    },
    uiFeatures: {
      showConfidenceScores: true,
      showAlternatives: true,
      showImpactPrediction: true,
      allowManualOverride: true,
      showProvenanceDetails: true,
    },
    badgeText: 'AI Autopilot',
  },
  
  enterprise: {
    autonomyModes: {
      available: ['off', 'assist', 'autopilot'],
      maxLevel: 'autopilot',
      default: 'autopilot',
    },
    approvalPolicy: {
      requiresApprovalByRisk: {
        low: false,
        medium: false,
        high: false, // Enterprise: AI can handle high-risk with sampling
        critical: true,
      },
      requiresApprovalByType: {
        lead_qualification: false,
        campaign_optimization: false,
        outreach_timing: false,
        message_generation: false,
        lead_scoring: false,
        playbook_execution: false,
        resource_allocation: false,
        priority_adjustment: false,
        workflow_automation: false,
      },
      samplingRate: 5, // Audit 5% of auto-approved decisions
      allowBypass: true, // Enterprise admin can override
    },
    governance: {
      whyDrawerEnabled: true,
      decisionHistoryEnabled: true,
      revertEnabled: true,
      auditTrailEnabled: true,
      confidenceThresholdsConfigurable: true, // Enterprise can configure
    },
    limits: {
      maxDecisionsPerDay: 10000,
      maxBatchSize: 1000,
      allowSystemWideDecisions: true,
    },
    riskTolerance: {
      allowedRiskLevels: ['low', 'medium', 'high', 'critical'],
      requireReviewAboveConfidence: 60, // Enterprise tolerates lower confidence
      autoBlockCriticalRisk: false, // Enterprise reviews critical but doesn't auto-block
    },
    uiFeatures: {
      showConfidenceScores: true,
      showAlternatives: true,
      showImpactPrediction: true,
      allowManualOverride: true,
      showProvenanceDetails: true,
    },
    badgeText: 'AI Governed',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get AI capabilities for a given plan tier
 */
export function getAICapabilities(plan: PlanTier): AICapabilities {
  return AI_CAPABILITIES_BY_PLAN[plan];
}

/**
 * Check if a specific autonomy mode is available for a plan
 */
export function isAutonomyModeAvailable(plan: PlanTier, mode: AIAutonomyMode): boolean {
  const capabilities = getAICapabilities(plan);
  return capabilities.autonomyModes.available.includes(mode);
}

/**
 * Check if a decision requires approval for a given plan and risk level
 */
export function requiresApproval(plan: PlanTier, riskLevel: AIRiskLevel, decisionType?: AIDecisionType): boolean {
  const capabilities = getAICapabilities(plan);
  
  // Check risk-based approval
  const riskRequiresApproval = capabilities.approvalPolicy.requiresApprovalByRisk[riskLevel];
  if (riskRequiresApproval) return true;
  
  // Check type-based approval
  if (decisionType && capabilities.approvalPolicy.requiresApprovalByType[decisionType]) {
    return true;
  }
  
  return false;
}

/**
 * Check if a risk level is allowed for a plan
 */
export function isRiskLevelAllowed(plan: PlanTier, riskLevel: AIRiskLevel): boolean {
  const capabilities = getAICapabilities(plan);
  return capabilities.riskTolerance.allowedRiskLevels.includes(riskLevel);
}

/**
 * Get the maximum autonomy level for a plan
 */
export function getMaxAutonomyLevel(plan: PlanTier): AIAutonomyMode {
  const capabilities = getAICapabilities(plan);
  return capabilities.autonomyModes.maxLevel;
}

/**
 * Get the badge text for AI features in a plan
 */
export function getAIBadgeText(plan: PlanTier): string {
  const capabilities = getAICapabilities(plan);
  return capabilities.badgeText || 'AI';
}

/**
 * Check if Why? drawer is enabled for a plan
 */
export function isWhyDrawerEnabled(plan: PlanTier): boolean {
  const capabilities = getAICapabilities(plan);
  return capabilities.governance.whyDrawerEnabled;
}

/**
 * Check if decision revert is enabled for a plan
 */
export function isRevertEnabled(plan: PlanTier): boolean {
  const capabilities = getAICapabilities(plan);
  return capabilities.governance.revertEnabled;
}

/**
 * Get daily decision limit for a plan
 */
export function getDecisionLimit(plan: PlanTier): number {
  const capabilities = getAICapabilities(plan);
  return capabilities.limits.maxDecisionsPerDay;
}

/**
 * Check if system-wide decisions are allowed for a plan
 */
export function allowSystemWideDecisions(plan: PlanTier): boolean {
  const capabilities = getAICapabilities(plan);
  return capabilities.limits.allowSystemWideDecisions;
}

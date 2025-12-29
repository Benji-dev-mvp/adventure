/**
 * AI Service
 * 
 * Frontend service for AI decisions, recommendations, and insights.
 * Currently uses demo data with plan-aware generation.
 * Ready for backend integration - swap demo mapper with API calls.
 */

import { 
  AIDecision, 
  AIRecommendation, 
  AIInsight,
  AIExplanation,
  AIDecisionListParams,
  AIDecisionListResponse,
  AIRecommendationListParams,
  AIRecommendationListResponse,
  AIInsightListParams,
  AIInsightListResponse,
  AIRiskLevel,
  AIDecisionStatus,
  AIDecisionType,
  AIPriority,
} from '../contracts/ai';
import { PlanTier } from '../demo/demoData';
import { getAICapabilities, requiresApproval } from '../contracts/aiCapabilities';

// ============================================================================
// DEMO DATA GENERATION
// ============================================================================

function generateDemoDecisions(plan: PlanTier, count: number): AIDecision[] {
  const capabilities = getAICapabilities(plan);
  const decisions: AIDecision[] = [];
  
  const decisionTypes: AIDecisionType[] = [
    'lead_qualification',
    'campaign_optimization',
    'outreach_timing',
    'message_generation',
    'lead_scoring',
    'playbook_execution',
  ];
  
  const riskLevels: AIRiskLevel[] = capabilities.riskTolerance.allowedRiskLevels;
  const statuses: AIDecisionStatus[] = ['proposed', 'approved', 'applied', 'reverted'];
  
  for (let i = 0; i < count; i++) {
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const decisionType = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100
    const needsApproval = requiresApproval(plan, riskLevel, decisionType);
    
    decisions.push({
      id: `ai-dec-${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      scope: i % 3 === 0 ? 'lead_batch' : 'single_lead',
      decisionType,
      entityRefs: [
        {
          entityType: 'lead',
          entityId: `lead-${Math.floor(Math.random() * 100) + 1}`,
          entityName: `Acme Corp Lead #${i + 1}`,
        },
      ],
      segment: plan,
      riskLevel,
      confidence,
      summary: getDecisionSummary(decisionType, riskLevel),
      rationale: getDecisionRationale(decisionType, confidence),
      inputs: [
        {
          type: 'engagement_score',
          source: 'email_tracker',
          value: Math.floor(Math.random() * 100),
          timestamp: new Date().toISOString(),
          confidence: 0.85,
        },
        {
          type: 'behavioral_signal',
          source: 'website_tracker',
          value: 'viewed_pricing_page',
          timestamp: new Date().toISOString(),
          confidence: 0.92,
        },
      ],
      beforeAfterDiff: [
        {
          field: 'status',
          before: 'contacted',
          after: 'qualified',
          impact: '+25% conversion likelihood',
        },
      ],
      recommendedActions: [
        {
          id: `action-${i + 1}`,
          type: 'send_email',
          label: 'Send follow-up email',
          requiresApproval: needsApproval,
          quotaCost: 1,
          executesOn: 'lead',
        },
      ],
      status: needsApproval && confidence < 80 ? 'proposed' : statuses[Math.floor(Math.random() * statuses.length)],
      provenance: {
        modelVersion: 'v2.3.1',
        dataSourcesUsed: ['crm', 'email_tracker', 'website_analytics'],
        computedAt: new Date().toISOString(),
      },
      requiresApproval: needsApproval,
      expectedImpact: {
        metric: 'conversion_rate',
        value: Math.floor(Math.random() * 15) + 5,
        unit: '%',
      },
    });
  }
  
  return decisions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateDemoRecommendations(plan: PlanTier, count: number): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  
  const priorities: AIPriority[] = ['low', 'medium', 'high', 'urgent'];
  const categories = ['optimization', 'engagement', 'conversion', 'efficiency', 'risk_mitigation'];
  
  for (let i = 0; i < count; i++) {
    recommendations.push({
      id: `ai-rec-${i + 1}`,
      title: getRecommendationTitle(i),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      entityRefs: [
        {
          entityType: i % 2 === 0 ? 'campaign' : 'lead',
          entityId: `entity-${i + 1}`,
          entityName: `Entity #${i + 1}`,
        },
      ],
      expectedImpact: {
        metric: 'conversion_rate',
        improvement: `+${Math.floor(Math.random() * 20) + 5}%`,
        confidence: Math.floor(Math.random() * 30) + 70,
      },
      effort: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      rationale: `Based on ${Math.floor(Math.random() * 100) + 50} similar campaigns, this optimization shows strong performance improvement.`,
      ctas: [
        {
          label: 'Apply Recommendation',
          action: 'apply',
          primary: true,
        },
        {
          label: 'View Details',
          action: 'details',
          primary: false,
        },
      ],
      category: categories[Math.floor(Math.random() * categories.length)] as any,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return recommendations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateDemoInsights(plan: PlanTier, count: number): AIInsight[] {
  const insights: AIInsight[] = [];
  
  const types = ['opportunity', 'warning', 'anomaly', 'recommendation'];
  const severities = ['info', 'warning', 'critical'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)] as any;
    const severity = severities[Math.floor(Math.random() * severities.length)] as any;
    
    insights.push({
      id: `ai-insight-${i + 1}`,
      type,
      severity,
      title: getInsightTitle(type, severity),
      description: getInsightDescription(type),
      entityRefs: [
        {
          entityType: 'lead',
          entityId: `lead-${i + 1}`,
          entityName: `Lead #${i + 1}`,
        },
      ],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      actionable: Math.random() > 0.3,
      suggestedActions: Math.random() > 0.5 ? [
        {
          id: `action-insight-${i + 1}`,
          type: 'send_email',
          label: 'Send immediate follow-up',
          requiresApproval: false,
          quotaCost: 1,
          executesOn: 'lead',
        },
      ] : undefined,
      dismissible: true,
    });
  }
  
  return insights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDecisionSummary(type: AIDecisionType, risk: AIRiskLevel): string {
  const summaries: Record<AIDecisionType, string> = {
    lead_qualification: `${risk === 'low' ? 'Low-risk' : 'High-potential'} lead qualified based on engagement signals`,
    campaign_optimization: `Campaign timing optimized for ${risk === 'low' ? 'standard' : 'high-value'} targets`,
    outreach_timing: `Optimal outreach window identified with ${risk === 'low' ? 'good' : 'strong'} conversion potential`,
    message_generation: `Personalized message generated with ${risk === 'low' ? 'template' : 'custom'} content`,
    lead_scoring: `Lead score adjusted based on recent activity`,
    playbook_execution: `Automated playbook ${risk === 'high' ? 'requiring review' : 'ready to execute'}`,
    resource_allocation: `Resource reallocation recommended`,
    priority_adjustment: `Lead priority updated based on signals`,
    workflow_automation: `Workflow trigger identified`,
  };
  return summaries[type] || 'AI decision made';
}

function getDecisionRationale(type: AIDecisionType, confidence: number): string {
  return `This decision is based on ${confidence}% confidence from historical patterns. ` +
    `Analysis of similar cases shows strong correlation with positive outcomes. ` +
    `Key factors: engagement velocity, behavioral signals, and timing indicators.`;
}

function getRecommendationTitle(index: number): string {
  const titles = [
    'Increase email frequency for engaged leads',
    'Adjust campaign targeting for better conversion',
    'Pause low-performing outreach sequence',
    'Re-engage dormant high-value leads',
    'Optimize send times based on response patterns',
    'Consolidate similar campaigns for efficiency',
    'Expand successful playbook to new segments',
    'Adjust lead scoring weights based on recent data',
  ];
  return titles[index % titles.length];
}

function getInsightTitle(type: string, severity: string): string {
  if (type === 'opportunity') return 'High-value lead showing strong buy signals';
  if (type === 'warning' && severity === 'critical') return 'Campaign performance degrading rapidly';
  if (type === 'anomaly') return 'Unusual spike in lead engagement detected';
  return 'AI recommendation ready for review';
}

function getInsightDescription(type: string): string {
  if (type === 'opportunity') return 'Lead has viewed pricing 3x in past 24 hours and opened last 2 emails within 5 minutes.';
  if (type === 'warning') return 'Campaign response rate dropped 40% in past 48 hours. Consider pausing or adjusting messaging.';
  if (type === 'anomaly') return 'Engagement rate 3x higher than baseline. Investigate cause and consider scaling.';
  return 'Review and apply AI-generated recommendation.';
}

// ============================================================================
// SERVICE API
// ============================================================================

export const aiService = {
  /**
   * List AI decisions with filtering and pagination
   */
  async listDecisions(params: AIDecisionListParams = {}, plan: PlanTier): Promise<AIDecisionListResponse> {
    // TODO: Replace with fetch(API_ROUTES.AI_DECISIONS) when backend ready
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const capabilities = getAICapabilities(plan);
    const count = Math.min(params.limit || 20, 100);
    let decisions = generateDemoDecisions(plan, count);
    
    // Apply filters
    if (params.status && params.status.length > 0) {
      decisions = decisions.filter(d => params.status!.includes(d.status));
    }
    
    if (params.riskLevel && params.riskLevel.length > 0) {
      decisions = decisions.filter(d => params.riskLevel!.includes(d.riskLevel));
    }
    
    if (params.decisionType && params.decisionType.length > 0) {
      decisions = decisions.filter(d => params.decisionType!.includes(d.decisionType));
    }
    
    return {
      items: decisions,
      total: decisions.length,
    };
  },
  
  /**
   * Get explanation for a specific AI decision (for Why? drawer)
   */
  async getExplanation(decisionId: string, plan: PlanTier): Promise<AIExplanation> {
    // TODO: Replace with fetch(API_ROUTES.AI_EXPLANATION(decisionId)) when backend ready
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      decisionId,
      summary: 'This decision was made by analyzing engagement patterns, timing signals, and historical conversion data.',
      factors: [
        {
          factor: 'Email engagement velocity',
          weight: 35,
          contribution: 'positive',
          explanation: 'Lead opened last 3 emails within 10 minutes each',
        },
        {
          factor: 'Website behavior',
          weight: 30,
          contribution: 'positive',
          explanation: 'Visited pricing page 2x and features page 5x in past 7 days',
        },
        {
          factor: 'Company fit score',
          weight: 20,
          contribution: 'positive',
          explanation: 'Company size and industry match ideal customer profile',
        },
        {
          factor: 'Timing indicator',
          weight: 15,
          contribution: 'neutral',
          explanation: 'Currently in evaluation phase based on behavioral signals',
        },
      ],
      dataUsed: [
        {
          source: 'Email tracking system',
          recordCount: 147,
          timeRange: 'Past 30 days',
        },
        {
          source: 'Website analytics',
          recordCount: 89,
          timeRange: 'Past 14 days',
        },
        {
          source: 'CRM data',
          recordCount: 523,
        },
      ],
      alternatives: [
        {
          alternative: 'Wait for additional engagement signals',
          whyNotChosen: 'Historical data shows immediate follow-up increases conversion by 23%',
        },
        {
          alternative: 'Assign to sales team without AI qualification',
          whyNotChosen: 'Current qualification confidence is high enough to proceed',
        },
      ],
      confidenceBreakdown: [
        {
          aspect: 'Data quality',
          confidence: 95,
          reason: 'High-fidelity tracking data with minimal gaps',
        },
        {
          aspect: 'Pattern match',
          confidence: 87,
          reason: 'Strong similarity to historical successful conversions',
        },
        {
          aspect: 'Timing accuracy',
          confidence: 82,
          reason: 'Based on 200+ similar timing predictions',
        },
      ],
    };
  },
  
  /**
   * List AI recommendations
   */
  async listRecommendations(params: AIRecommendationListParams = {}, plan: PlanTier): Promise<AIRecommendationListResponse> {
    // TODO: Replace with fetch(API_ROUTES.AI_RECOMMENDATIONS) when backend ready
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const count = Math.min(params.limit || 10, 50);
    let recommendations = generateDemoRecommendations(plan, count);
    
    // Apply filters
    if (params.priority && params.priority.length > 0) {
      recommendations = recommendations.filter(r => params.priority!.includes(r.priority));
    }
    
    if (params.category) {
      recommendations = recommendations.filter(r => r.category === params.category);
    }
    
    return {
      items: recommendations,
      total: recommendations.length,
    };
  },
  
  /**
   * List AI insights (real-time signals)
   */
  async listInsights(params: AIInsightListParams = {}, plan: PlanTier): Promise<AIInsightListResponse> {
    // TODO: Replace with fetch(API_ROUTES.AI_INSIGHTS) when backend ready
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const count = Math.min(params.limit || 5, 20);
    let insights = generateDemoInsights(plan, count);
    
    // Apply filters
    if (params.type && params.type.length > 0) {
      insights = insights.filter(i => params.type!.includes(i.type));
    }
    
    if (params.severity && params.severity.length > 0) {
      insights = insights.filter(i => params.severity!.includes(i.severity));
    }
    
    return {
      items: insights,
      total: insights.length,
    };
  },
  
  /**
   * Approve an AI decision
   */
  async approveDecision(decisionId: string): Promise<{ success: boolean; message: string }> {
    // TODO: Replace with fetch(API_ROUTES.AI_APPROVE(decisionId), { method: 'POST' })
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      message: `Decision ${decisionId} approved and queued for execution`,
    };
  },
  
  /**
   * Revert an AI decision
   */
  async revertDecision(decisionId: string, reason: string): Promise<{ success: boolean; message: string }> {
    // TODO: Replace with fetch(API_ROUTES.AI_REVERT(decisionId), { method: 'POST', body: { reason } })
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      message: `Decision ${decisionId} reverted successfully`,
    };
  },
};

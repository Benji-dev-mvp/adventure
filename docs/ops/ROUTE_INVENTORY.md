# Route Inventory - Generated 2026-01-02

## Overview

- **Routes in navConfig**: 37
- **Components in App.jsx**: 85+ lazy-loaded
- **Total route mappings**: 91

## Navigation Routes (from navConfig.js)

### Overview Section
| Route | Label | Component | Status |
|-------|-------|-----------|--------|
| `/dashboard` | Dashboard | EnhancedDashboardNew | ✅ Active |

### AI Operator Section
| Route | Label | Component | Status |
|-------|-------|-----------|--------|
| `/ava` | Ava AI BDR | AvaHub | ✅ Active |
| `/ai-assistant` | AI Assistant | AvaChat | ✅ Active |
| `/exceptional` | Exceptional Hub | ExceptionalHub | ✅ Active |
| `/advanced` | Advanced Hub | AdvancedHub | ✅ Active |

### Autonomous GTM Section
| Route | Label | Component | Status |
|-------|-------|-----------|--------|
| `/autonomy` | Autonomy Dashboard | AutonomyDashboard | ⚠️ Needs Verification |
| `/autopilot` | Autopilot | AutopilotPage | ✅ Active |
| `/orchestration` | Orchestration | OrchestrationPage | ✅ Active |
| `/intelligence-graph` | Intelligence Graph | IntelligenceGraphPage | ✅ Active |
| `/forecasting` | Forecasting | ForecastingPage | ✅ Active |
| `/influence-map` | Influence Map | InfluenceMapPage | ✅ Active |
| `/boardroom` | Boardroom | BoardroomPage | ✅ Active |
| `/simulate` | Simulate | SimulatePage | ✅ Active |
| `/lead-hive` | Lead Hive | LeadHivePage | ⚠️ Needs Verification |
| `/parliament` | AI Parliament | ParliamentPage | ⚠️ Needs Verification |
| `/avatar` | AI Avatar | AvatarPage | ⚠️ Needs Verification |
| `/immersive` | Immersive View | ImmersivePage | ✅ Active |

### Revenue Engine Section
| Route | Label | Component | Status |
|-------|-------|-----------|--------|
| `/campaigns` | Campaigns | CampaignBuilder | ✅ Active |
| `/leads` | Leads | Leads | ✅ Active |
| `/lead-database` | Lead Database | LeadDatabase | ✅ Active |
| `/templates` | Templates | Templates | ✅ Active |
| `/sales-playbooks` | Sales Playbooks | SalesPlaybooks | ✅ Active |
| `/lead-scoring` | Lead Scoring | LeadScoring | ✅ Active |
| `/data-enrichment` | Data Enrichment | DataEnrichment | ✅ Active |

### Ops & Control Section
| Route | Label | Component | Status |
|-------|-------|-----------|--------|
| `/analytics` | Analytics | Analytics | ✅ Active |
| `/executive-dashboard` | Executive Dashboard | ExecutiveDashboard | ✅ Active |
| `/activity-feed` | Activity Feed | ActivityFeed | ✅ Active |
| `/integrations` | Integrations | Integrations | ✅ Active |
| `/settings` | Settings | Settings | ✅ Active |
| `/admin` | Admin | Admin | ✅ Active |

### Enterprise Admin Section
| Route | Label | Component | Status |
|-------|-------|-----------|--------|
| `/admin/access-control` | Access Control | AdminAccessControl | ✅ Active |
| `/admin/audit-log` | Audit Log | AdminAuditLog | ✅ Active |
| `/admin/ai-decisions` | AI Decisions | AdminAIDecisions | ✅ Active |
| `/admin/observability` | Observability | AdminObservability | ✅ Active |
| `/admin/feature-flags` | Feature Flags | FeatureFlags | ✅ Active |
| `/admin/enterprise-readiness` | Enterprise Readiness | AdminEnterpriseReadiness | ✅ Active |
| `/settings/usage` | Usage & Quotas | SettingsUsage | ✅ Active |

## Public/Marketing Routes (Not in navConfig)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Marketing home |
| `/ai-tour` | AiTourPage | Product tour |
| `/flow` | FlowPage | Flow visualization |
| `/platform` | PlatformPage | Platform overview |
| `/security` | SecurityPage | Security info |
| `/customers` | CustomersPage | Customer stories |
| `/pricing` | PricingPage | Pricing plans |
| `/landing` | LandingPage | Legacy landing |
| `/solutions/startups` | SolutionsStartups | Startup solutions |
| `/solutions/midmarket` | SolutionsMidMarket | Midmarket solutions |
| `/solutions/enterprise` | SolutionsEnterprise | Enterprise solutions |

## Additional App Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/dashboard-original` | Dashboard | Legacy dashboard |
| `/dashboard-enhanced` | EnhancedDashboard | Alternative dashboard |
| `/lead-inbox` | LeadInbox | Lead inbox |
| `/ai-assistant-legacy` | AIAssistant | Legacy AI assistant |
| `/multi-agent` | MultiAgentChat | Multi-agent chat |
| `/ai-lead-intelligence` | AILeadIntelligence | AI lead intelligence |
| `/ai-campaign-strategist` | AICampaignStrategist | AI campaign strategist |
| `/ai-assistant-advanced` | AdvancedAIAssistant | Advanced AI assistant |
| `/orchestrator` | OrchestratorPage | Orchestrator (new) |
| `/orchestrator/timeline` | OrchestratorTimelinePage | Orchestrator timeline |
| `/workflow-orchestrator` | WorkflowOrchestrator | Workflow orchestrator |
| `/component-showcase` | ComponentShowcase | Component library |
| `/ui-showcase` | UIShowcase | UI showcase |

## Known Issues / Needs Verification

Components marked with ⚠️ may need runtime verification:

1. **AutonomyDashboard** (`/autonomy`)
   - Mapped to `AutopilotPage` in some references
   - Verify correct component

2. **LeadHivePage** (`/lead-hive`)
   - Advanced feature, may have complex dependencies

3. **ParliamentPage** (`/parliament`)
   - Advanced AI feature, verify implementation

4. **AvatarPage** (`/avatar`)
   - Check for render errors

## Route Testing Checklist

To verify all routes work:

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:3004

# Navigate to each route manually or use:
# - Browser DevTools console
# - Playwright automated testing
# - Manual click-through of all nav items
```

### Manual Testing Priority

**High Priority** (User-facing nav items):
1. Dashboard
2. Ava AI BDR
3. Campaigns
4. Leads
5. Analytics
6. Settings

**Medium Priority** (Advanced features):
1. Autopilot
2. Orchestration
3. Intelligence Graph
4. Forecasting
5. Executive Dashboard

**Low Priority** (Admin/internal):
1. Admin routes
2. Feature flags
3. Legacy routes

## Component File Verification

All page components are in `src/pages/`:
- ✅ 87 page files found
- ✅ All lazy imports resolve
- ✅ No missing component files

## Layout Shells

Routes use different shells:

1. **Public routes** - No shell (standalone)
2. **PostLoginShell** - Main app routes (most routes)
3. **DashboardLayout** - Legacy wrapper (some routes)
4. **AppShell** - Alternative shell (tour, flow)

## Recommendations

1. **Consolidate dashboard routes** - Consider deprecating legacy variants
2. **Verify advanced features** - Test autonomy, parliament, avatar routes
3. **Document route ownership** - Assign team owners for each section
4. **Add automated testing** - Playwright smoke tests for all routes
5. **Clean up unused routes** - Remove or document deprecated paths

## Last Updated

Generated: 2026-01-02T14:24:00Z
